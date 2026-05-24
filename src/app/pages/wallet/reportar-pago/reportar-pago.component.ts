import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalInstruccionesComponent } from '../../../components/modal-instrucciones/modal-instrucciones.component';
import { Profile } from '../../../models/favorite.model';
import { PaymentMethod } from '../../../models/paymentmethod.model';
import { FileUploadService } from '../../../services/file-upload.service';
import { SkeletonLoaderComponent } from '../../../shared/skeleton-loader/skeleton-loader.component';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { PaymentmethodService } from '../../../services/paymentmethod.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { PaymentService } from '../../../services/payment.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { Solicitud } from '../../../models/solicitud.model';


@Component({
  selector: 'app-reportar-pago',
  imports: [CommonModule, SkeletonLoaderComponent, BackButtnComponent, ReactiveFormsModule,
    ModalInstruccionesComponent
  ],
  templateUrl: './reportar-pago.component.html',
  styleUrl: './reportar-pago.component.scss'
})
export class ReportarPagoComponent {
  title = 'Volver';
  isLoading = false;
  // tasa = signal(0);
  tasa = 508;
  imagePreview = signal<string | null>(null);
  userId!: string;
  paymentSelected!: any;
  paymentMethods: PaymentMethod[] = [];
  user!: any;
  // solicitud!:Solicitud;
  usuario_id!: any;
  amount!: number;

  // Uso nativo de Signals modernos de Angular 19
  public solicitud = signal<any>(null);
  public loading = signal<boolean>(false);
  
  public paymentForm!: FormGroup;
  public selectedFile: File | null = null;
  

  info = `
  <h2>Sección: Reportar Pago</h2>
  <p><strong>Nota importante:</strong> Actualmente no utilizamos pasarelas de pago directo. Cualquier actualización sobre métodos de pago automatizados será informada oportunamente a través de la <strong>Cartelera</strong> o <strong>Notificaciones</strong>.</p>
  
  <p>Para reportar tu pago con éxito, sigue estas instrucciones:</p>
  <ul>
    <li><strong>Datos de Transferencia:</strong> Al seleccionar tu método de pago preferido, el sistema te mostrará automáticamente los datos bancarios del beneficiario para que realices la operación desde tu banca en línea.</li>
    <li><strong>Registro de Información:</strong> Completa los campos solicitados: Banco de destino y los números o códigos de la <strong>Referencia Bancaria</strong>.</li>
    <li><strong>Monto del Pago:</strong> El monto ya viene predeterminado según la factura que seleccionaste; no es necesario modificarlo.</li>
    <li><strong>Comprobante Digital (Obligatorio):</strong> Es indispensable adjuntar la imagen o captura de pantalla de tu pago. Esto nos permite validar tu reporte de manera mucho más eficiente.</li>
  </ul>`;

 private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  
  // Servicios de tu ecosistema
  private authService = inject(AuthService);
  private solicitudService = inject(SolicitudesService);
  private paymentService = inject(PaymentService);
  private paymenttiposService = inject(PaymentmethodService);
  private fileUploadService = inject(FileUploadService);

  


  ngOnInit() {
   window.scrollTo(0, 0);
    this.user = this.authService.getLocalStorage();
    this.inicializarFormulario();
    this.getTasadelDia();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const state = window.history.state;

    if (id === 'deuda-total') {
      if (state && state.solicitud) {
        this.solicitud.set(state.solicitud);
        this.procesarMontoYReceptor(state.solicitud);
      }
    } else if (id && id !== 'nuevo') {
      if (state && state.solicitud) {
        this.solicitud.set(state.solicitud);
        this.procesarMontoYReceptor(state.solicitud);
      } else {
        // Petición de respaldo a la API si el usuario refrescó la página flotante
        this.solicitudService.getSolicitud(id).subscribe((resp: any) => {
          // Si tu API responde con { ok: true, solicitud: {...} }, usa resp.solicitud
          const datosSolicitud = resp.solicitud || resp;
          this.userId = datosSolicitud.usuario.uid;
          this.solicitud.set(datosSolicitud);
          this.procesarMontoYReceptor(datosSolicitud);
          this.getPaymentsMethods();
        });
      }
    }
  }

   getPaymentsMethods() {
    this.paymenttiposService.getByUser(this.usuario_id).subscribe((resp: any) => {
      this.paymentMethods = resp;
    })
  }

  private inicializarFormulario() {
    this.paymentForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      referencia: ['', [Validators.required, Validators.minLength(4)]],
      bank_destino: ['', [Validators.required]],
      metodo_pago: ['', [Validators.required]]
    });
  }

  /**
   * Helper privado para extraer de forma segura el monto acumulado del pedido y el ID del abogado
   */
  private procesarMontoYReceptor(solicitudData: any) {
    if (!solicitudData) return;

    // Sumamos los precios de todos los items en el arreglo 'pedido' de forma segura
    let montoCalculado = 0;
    if (Array.isArray(solicitudData.pedido)) {
      montoCalculado = solicitudData.pedido.reduce((acc: number, item: any) => acc + (Number(item.precio) || 0), 0);
    }

    // Rellenamos el control del formulario reactivo
    this.paymentForm.patchValue({ amount: montoCalculado });

    // Extraemos de forma estricta el ID del abogado de tu JSON (vienen en .uid o en ._id según el populate)
    if (solicitudData.usuario) {
      this.usuario_id = solicitudData.usuario.uid || solicitudData.usuario._id || solicitudData.usuario;
    }
  }

enviarPago() {
    const solicitudData = this.solicitud();
    if (!solicitudData || this.loading()) return;
    if (this.paymentForm.invalid) {
      this.toastr.error('Por favor complete todos los campos obligatorios del formulario');
      return;
    }

    this.loading.set(true);
    const solicitudId = solicitudData._id;

    // 💡 SOLUCIÓN SUBIDA DE IMAGEN: Usamos el ID del cliente logueado temporalmente para asegurar un archivo único,
    // o el ID de la solicitud si tu fileUploadService está ruteado estrictamente de esa manera.
    this.fileUploadService
      .actualizarFoto(this.selectedFile!, 'pagos', solicitudId)
      .then(imgUrl => {
        
        // CONSTRUCCIÓN DEL PAYLOAD FIEL A TU ESQUEMA REAL DE MONGO
        const payload = {
          referencia: this.paymentForm.get('referencia')?.value,
          amount: this.paymentForm.get('amount')?.value,
          img: imgUrl,
          
          // 🟢 CRÍTICO: El receptor del dinero exigido por tu PagoSchema (El abogado)
          usuario: this.usuario_id, 
          
          // El emisor del dinero (El cliente logueado)
          cliente: this.user.uid,
          
          // Relaciones adicionales del documento
          solicitud: solicitudId === 'DEUDA_TOTAL' ? null : solicitudId,
          
          // Campos de auditoría heredados de tu pasarela de Parque Central
          tasaBCV: this.tasa,
          metodo_pago: this.paymentSelected?.tipo,
          bank_destino: this.paymentForm.get('bank_destino')?.value,
          esPagoTotal: solicitudId === 'DEUDA_TOTAL'
        };

        this.paymentService.createPayment(payload).subscribe({
          next: () => {
            this.toastr.success('¡Pago reportado con éxito! El profesional ha sido notificado.');
            this.router.navigate(['/mis-pagos']);
          },
          error: (err) => {
            this.loading.set(false);
            this.toastr.error('Error al registrar la transacción en el servidor');
          }
        });
      })
      .catch(err => {
        this.loading.set(false);
        this.toastr.error('Error al procesar la carga del comprobante adjunto');
      });
  }



 

  // metodo para el cambio del select 'tipo de transferencia'

  onChangePayment(event: Event) {
    const target = event.target as HTMLSelectElement;
    const idSeleccionado = target.value;

    // Buscamos el objeto completo
    this.paymentSelected = this.paymentMethods.find(method => method._id === idSeleccionado);

    if (this.paymentSelected) {
      // Seteamos automáticamente el valor en el campo 'bank_destino' del formulario
      this.paymentForm.patchValue({
        bank_destino: this.paymentSelected.bankName
      });
    }
  }

  getTasadelDia() {
    // this.tasaBcvService.getUltimaTasa().subscribe((resp: any) => {
    //   this.tasa.set(resp.precio_dia);
    // })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }


}
