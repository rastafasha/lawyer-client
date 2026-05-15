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
  isLoading: boolean = false;
  title = 'Volver';

  // Signals
  solicitud = signal<any>(null); // Viene de la pantalla anterior
  // tasa = signal(0);
  tasa = 508;
  loading = signal(false);
  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;
  userId!: string;
  paymentSelected!: any;
  paymentMethods: PaymentMethod[] = [];
  user!: any;
  // solicitud!:Solicitud;
  usuario_id!: any;
  amount!: number;

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

  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private paymenttiposService = inject(PaymentmethodService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public toastr = inject(ToastrService);
  private fileUploadService = inject(FileUploadService);
  private authService = inject(AuthService);
  private solicitudService = inject(SolicitudesService);

  paymentForm: FormGroup = this.fb.group({
    metodo_pago: ['', Validators.required],
    bank_destino: ['', Validators.required],
    referencia: ['', [Validators.required, Validators.minLength(4)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    img: [null, Validators.required],

  });



  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.authService.getLocalStorage();
    this.getTasadelDia();
    // this.getPaymentsMethods();
    // 1. Obtenemos el ID de la URL
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    // 2. Obtenemos los datos extendidos (monto, nroFactura) del historial
    const state = window.history.state;
    if (id === 'deuda-total') {
      // Caso: Viene del Home con el monto acumulado
      if (state && state.solicitud) {
        this.solicitud.set(state.solicitud);
        this.paymentForm.patchValue({ amount: state.solicitud.pedido[0].precio });
      }
    } else if (id && id !== 'nuevo') {
      // Caso: Viene de una solicitud específica
      if (state && state.solicitud) {
        this.solicitud.set(state.solicitud);
        this.paymentForm.patchValue({ amount: state.solicitud.pedido[0].precio });
      } else {
        // Solo llamamos a la API si NO es 'deuda-total'
        this.solicitudService.getSolicitud(id).subscribe((resp: any) => {
          // 1. Guardas la respuesta completa en el Signal
          this.solicitud.set(resp);

          // 2. Extraes el precio desde el Signal recién actualizado
          const precioPedido = this.solicitud()?.pedido?.[0]?.precio;
          // 3. Rellenas el formulario con el monto (Solución al problema)
          if (precioPedido) {
            this.paymentForm.patchValue({ amount: precioPedido });
          }
          // 2. Lees el Signal ejecutándolo como función () y accedes a .cliente.uid
          this.usuario_id = this.solicitud()?.usuario?.uid;
          this.getPaymentsMethods();
        })
      }
    }
  }



  getPaymentsMethods() {
    this.paymenttiposService.getByUser(this.usuario_id).subscribe((resp: any) => {
      this.paymentMethods = resp;
    })
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

  enviarPago() {
    debugger
    const solicitudData = this.solicitud();
    if (!solicitudData || this.loading()) return;

    // Si es un pago de deuda total, el ID será 'DEUDA_TOTAL' o null según prefiera tu backend
    const solicitudId = solicitudData._id;

    this.loading.set(true);

    this.fileUploadService
      .actualizarFoto(this.selectedFile!, 'pagos', solicitudData._id)
      .then(imgUrl => {
        const payload = {
          solicitud: solicitudId === 'DEUDA_TOTAL' ? null : solicitudId, // Enviamos null si es abono general
          esPagoTotal: solicitudId === 'DEUDA_TOTAL', // Flag útil para el backend
          cliente: this.userId,
          amount: this.paymentForm.get('amount')?.value,
          tasaBCV: this.tasa,
          referencia: this.paymentForm.get('referencia')?.value,
          metodo_pago: this.paymentSelected?.tipo,
          bank_destino: this.paymentForm.get('bank_destino')?.value,
          img: imgUrl
        };

        this.paymentService.createPayment(payload).subscribe({
          next: () => {
            this.toastr.success('¡Pago reportado con éxito!');
            this.router.navigate(['/mis-pagos']);
          },
          error: () => {
            this.loading.set(false);
            this.toastr.error('Error al registrar el pago');
          }
        });
      })
      .catch(err => {
        this.loading.set(false);
        this.toastr.error('Error al subir el comprobante');
      });
  }


}
