import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../../services/document.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Document } from '../../../models/document.model';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClientService } from '../../../services/client.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../services/file-upload.service';
import { ModalAgregarComponent } from './modal-agregar/modal-agregar.component';
import { ArchivosCategoriaComponent } from './archivosCategoria/archivosCategoria.component';
import Swal from 'sweetalert2';
import { ArchivosCompartidosComponent } from './archivos-compartidos/archivos-compartidos.component';

declare let $: any;
@Component({
  selector: 'app-documents',
  imports: [
    CommonModule,
    HeaderComponent,
    MenuFooterComponent,
    BackButtnComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LoadingComponent,
    TranslateModule,
    ModalAgregarComponent,
    ArchivosCategoriaComponent,
    ArchivosCompartidosComponent
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  pageTitle = 'Documents';
  isLoading: boolean = false;
  isLoadingList: boolean = false;
  isLoadingUpload: boolean = false;
  isRefreshing = false;
  
  valid_form_success = false;
  public text_validation = '';
  public text_success = '';

  FILES: any = [];
  FilesAdded: any = [];
  public file_selected: any;
  public user_files: Document[] = [];
  public sharedFiles: Document[] = [];
  public user_filesfiltered: Document[] = [];
  public document!: Document;
  
  
  user_id!: string;
  user!: any;
  public rol?: string;
  currentPage = 1;
  
  share: any;

  
  documentForm!: FormGroup;

  document_selected: any = null;
  public user_cliente_id!: string;
  public cliente_id!: string;
  public user_member_id!: string;
  public clientes: any = [];

  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = "assets/images/no-image.jpg";

  public imagenSubir!: File;
  public imgTemp: any = null;
  public isLoadingImage: boolean = false;

  archivoSubir: File | null = null;
  vistaPreviaTemp: any = "assets/images/no-image.jpg";
  esPdf: boolean = false; // Nos dirá si el archivo es PDF o Imagen

  option_selectedd: number = 1;
    solicitud_selectedd: any = 1;

  constructor(
    private authService: AuthService,
    public documentService: DocumentService,
    public clientService: ClientService,
    public router: Router,
    public ativatedRoute: ActivatedRoute,
    public fb: FormBuilder,
    public toastr: ToastrService,
    private fileUploadService: FileUploadService,

  ) {
    this.user = this.authService.getLocalStorage();

  }
  ngOnInit(): void {
    this.user_id = this.user.uid;
    this.rol = this.user.role;
    
    this.validarFormularioDocumento();
    this.getdocumentsbyUser();
    this.getShared();
  }

    optionSelected(value: number) {
      this.option_selectedd = value;
      if (this.option_selectedd === 1) {
  
        this.getdocumentsbyUser();
      }
      if (this.option_selectedd === 2) {
        this.getShared();
      }
    }




 

  getdocumentsbyUser() {
    this.isLoading = true;
    this.currentPage;
    this.documentService.getDocumentsByUser(
      this.user_id).subscribe((resp: any) => {
        this.FILES = resp
        this.isLoading = false;
        //agrupamos por name_category
        this.FILES.forEach((element: any) => {
          if (!this.user_files.find((doc: Document) => doc.name_category == element.name_category)) {
            this.user_files.push(element);
          }
        });
      })
  }

  getShared(){
     this.isLoading = true;
    this.documentService.getDocumentsSharedwithme(this.user_id).subscribe((resp:any)=>{
      this.sharedFiles = resp;
      this.isLoading = false;
    })
  }

  getDocumentsbyCategory(name_category: string) {
    this.isLoadingList = true;
    this.documentService.getDocumentsByUserCategory(this.user_id, name_category).subscribe((resp: any) => {
      this.user_filesfiltered = resp;
      this.isLoadingList = false;
    })
  }

 

  deleteFile(FILE: any) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: "No podras recuperarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentService.deleteDocument(FILE).subscribe(
          response => {
            this.ngOnInit();
          }
        )
        this.FilesAdded.splice(FILE, 1);
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });
  }


  selectDoc(FILE: any) {
    this.file_selected = FILE;
  }

  cambiarImagen(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      this.vistaPreviaTemp = null;
      this.archivoSubir = null;
      return;
    }

    // 1. Validar formatos permitidos (Imágenes o PDF)
    const esImagen = file.type.startsWith('image/');
    const esDocumentoPdf = file.type === 'application/pdf';

    if (!esImagen && !esDocumentoPdf) {
      this.toastr.error('Solo se permiten imágenes (PNG, JPG) o documentos PDF', 'Formato no soportado');
      event.target.value = ''; // Resetea el input en el HTML
      this.vistaPreviaTemp = null;
      this.archivoSubir = null;
      return;
    }

    // 2. Guardar archivo y tipo
    this.archivoSubir = file;
    this.esPdf = esDocumentoPdf;

    // 3. Generar Base64 para la vista previa en el HTML
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.vistaPreviaTemp = reader.result;
    };
  }



  closeReload() {
    this.documentForm.reset();
    this.vistaPreviaTemp = null;
    // Cierra el offcanvas (Bootstrap) y recarga la lista.
    // El modal llama a este método directamente como callback.
    this.ngOnInit();
  }

  save(eventData: { archivo: File, categoria: string }) {
    this.text_success = '';
    this.text_validation = '';

    // 1. ELIMINADO: Ya no leemos 'this.documentForm' en el padre.
    // Las validaciones de si la categoría o el archivo existen ya se hicieron en el hijo 
    // antes de lanzar el .emit(). Solo validamos por seguridad el parámetro recibido:
    if (!eventData.archivo) {
      this.toastr.error('Error', 'Necesitas seleccionar un recurso');
      return;
    }

    this.isLoadingUpload = true;

    // 2. Llamar al servicio usando directamente las variables limpias que te envió el hijo (eventData)
    this.fileUploadService
      .actualizarFoto(eventData.archivo, 'documents', this.user.uid, eventData.categoria)
      .then(resp => {
        this.isLoadingUpload = false;

        if (!resp) {
          this.toastr.error('Error', 'No se pudo procesar el documento en el servidor');
          return;
        }

        // Éxito total: subido a Cloudinary y persistido en MongoDB
        this.toastr.success('Se guardó el recurso con éxito');
        this.getdocumentsbyUser(); // Recarga tu lista de documentos en pantalla

        // 3. Notificación de cierre:
        // Para limpiar el formulario del hijo, lo ideal es pasarle una señal o dejar 
        // que el hijo se limpie solo al recibir que 'isLoading' volvió a false.
        this.closeModal.emit();
      })
      .catch(err => {
        this.isLoadingUpload = false;
        console.error(err);
        this.toastr.error('Error', 'Ocurrió un error inesperado al subir el archivo');
      });
  }

  onScrollUp() {
    this.refreshData();
  }

  refreshData() {
    this.isRefreshing = true;
    // Simulate data fetching 
    setTimeout(() => {
      this.isRefreshing = false;
      this.ngOnInit();
    }, 2000);
  }

  // compartir archivo
  solicitudSelected(documentId: any) {
    // 1. Save the selected document ID in the parent state
    this.document_selected = documentId;
    console.log(this.document_selected)
    // 2. Fetch the clients list (which populates this.clientes)
    this.getClientesbyuser();
  }
  getClientesbyuser() {
    this.clientService.getMySpecialists(this.user.uid).subscribe((resp: any) => {
      this.clientes = resp.specialists;
    })

  }

  onShareIt(eventData: { emailACompartir: string }) {

    if (!eventData.emailACompartir) {
      this.toastr.warning('Por favor, selecciona un usuario con quien compartir.');
      return;
    }

    const data = {
      documentId: this.document_selected,
      usuario: this.user.uid,        // The owner of the file
      emailACompartir: eventData.emailACompartir // The selected email payload sent by the child
    };

    this.documentService.shareDocument(data).subscribe({
      next: (resp: any) => {
        this.toastr.success('Se ha compartido el documento con éxito');
        this.document_selected = null; // Clear selection to reset the UI dropdown view
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error', 'No se pudo compartir el archivo');
      }
    });
  }


 
  validarFormularioDocumento() {
    this.documentForm = this.fb.group({
      name_category: [''],
      created_at: [''],
      name_file: [''],
      user_id: [this.user.id],
    });
  }




}
