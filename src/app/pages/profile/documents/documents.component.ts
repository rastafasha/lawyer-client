import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { LateralComponent } from '../../../components/lateral/lateral.component';
import { DocumentService } from '../../../services/document.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';
import { Document } from '../../../models/document.model';
import { environment } from '../../../environments/environment';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { ClientService } from '../../../services/client.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../services/file-upload.service';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';
const baseUrl = environment.url_servicios;
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
    SafeUrlPipe
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  pageTitle = 'Documents';
  isLoading: boolean = false;
  isRefreshing = false;
  isSearching = false;
  valid_form_success = false;
  public text_validation = '';
  public text_success = '';

  FILES: any = [];
  FilesAdded: any = [];
  public file_selected: any;
  public user_files: Document[] = [];
  public user_filesfiltered: Document[] = [];
  public document!: Document;
  public name_category: string = '';
  public name_file: string = '';
  public created_at!: string;
  user_id!: string;
  user!: any;
  public rol?: string;

  currentPage = 1;
  share: any;

  searchForm!: FormGroup;
  documentForm!: FormGroup;

  document_selected: any = null;
  public user_cliente_id!: number;
  public cliente_id!: number;
  public user_member_id!: number;
  public clientes: any = [];

  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = "assets/images/no-image.jpg";

  public imagenSubir!: File;
  public imgTemp: any = null;
  public isLoadingImage: boolean = false;

  archivoSubir: File | null = null;
  vistaPreviaTemp: any = "assets/images/no-image.jpg";
  esPdf: boolean = false; // Nos dirá si el archivo es PDF o Imagen

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
    this.validarFormularioPerfil();
    this.validarFormularioDocumento();
    this.getdocumentsbyUser();
    // this.getdocumentsbyUserFilter();
    this.searchForm.reset();
  }

  validarFormularioPerfil() {
    if (!this.searchForm) {
      this.searchForm = this.fb.group({
        name_category: [''],
        created_at: [''],
        name_file: [''],
        user_id: [this.user.id],
      });
    }
  }
  validarFormularioDocumento() {
    this.documentForm = this.fb.group({
      name_category: [''],
      created_at: [''],
      name_file: [''],
      user_id: [this.user.id],
    });
  }


  searchData() {
    const formValue = this.searchForm.value;
    this.isSearching = true;
    this.name_file = this.name_file.toLowerCase();
    // this.characters = this.characters.filter((character: any) => {
    //   return character.name.toLowerCase().includes(this.search);
    //   });
    this.getdocumentsbyUserFilter();
  }
  resetSearch(): void {
    this.isSearching = false;
    this.searchForm.reset();
    this.ngOnInit();
  }

  getdocumentsbyUserFilter() {
    this.isLoading = true;
    this.currentPage;
    this.name_category = this.searchForm.value.name_category;
    this.created_at = this.searchForm.value.created_at;
    this.name_file = this.searchForm.value.name_file;
    this.documentService.getAllClientReportByPatient(
      this.user_id,
      this.currentPage,
      this.created_at,
      this.name_category,
      this.name_file,
    ).subscribe((resp: any) => {
      this.FILES = resp.data;
      this.isLoading = false;

    })
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

  getDocumentsbyCategory(name_category: string) {
    this.documentService.getDocumentsByUserCategory(this.user_id, name_category).subscribe((resp: any) => {
      this.user_filesfiltered = resp;
    })
  }



  deleteFile(FILE: any) {
    this.documentService.deleteDocument(FILE).subscribe((resp: any) => {
      this.ngOnInit();
    })
    this.FilesAdded.splice(FILE, 1);
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
    this.vistaPreviaTemp = null
    this.closeModal.emit();
    this.ngOnInit();
  }
save() {
  this.text_success = '';
  this.text_validation = '';

  // 1. Extraer el valor directamente del Form外部 (Reactive Form)
  const categoriaValor = this.documentForm.get('name_category')?.value;

  // 2. Validar que la categoría no esté vacía o con puros espacios
  if (!categoriaValor || categoriaValor.trim() === '') {
    this.toastr.warning('Es requerido ingresar un nombre de categoría');
    return;
  }

  // 3. Validar que exista el archivo en tu arreglo/propiedad de selección
  // (Nota: Asegúrate si usas this.FILES o this.archivoSubir de acuerdo a tu método cambiarImagen)
  if (!this.archivoSubir) { 
    this.toastr.error('Error', 'Necesitas seleccionar un recurso');
    return;
  }

  this.isLoading = true;

  // 4. Llamar al servicio unificado enviando el valor correcto del formulario
  this.fileUploadService
    .actualizarFoto(this.archivoSubir, 'documents', this.user.uid, categoriaValor)
    .then(resp => {
      this.isLoading = false;
      
      if (!resp) {
        this.toastr.error('Error', 'No se pudo procesar el documento en el servidor');
        return;
      }

      // Éxito total: subido a Cloudinary y persistido en MongoDB
      this.toastr.success('Se guardó el recurso con éxito');
      this.closeModal.emit();
      this.getdocumentsbyUser(); // Recarga la lista de documentos en pantalla
      
      // Limpiar formulario y variables
      this.documentForm.reset();
      this.archivoSubir = null;
    })
    .catch(err => {
      this.isLoading = false;
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
  solicitudSelected(document: any) {
    this.document_selected = document;
    this.user_member_id = this.user.id;
    this.user_cliente_id = this.user.id;
    this.getClientesbyuser();

  }

  getClientesbyuser() {
    this.clientService.getMySpecialists(this.user_id).subscribe((resp: any) => {
      this.clientes = resp.specialists;
    })

  }


  onShareIt(document: any) {
    this.document_selected = document;
    const data = {
      document_id: this.document_selected,
      user_id: this.user.id,
      client_id: this.share,
    }
    this.documentService.shareDocument(data).subscribe((resp: any) => {
      this.toastr.success('Se ha Compartido el Documento')
    })
  }




}
