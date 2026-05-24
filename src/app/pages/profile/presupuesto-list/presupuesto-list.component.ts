import { Component, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PresupuestoService } from '../../../services/presupuesto.service';
import { Presupuesto } from '../../../models/presupuesto';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { ModalInstruccionesComponent } from '../../../components/modal-instrucciones/modal-instrucciones.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { BusquedasService } from '../../../services/busqueda.service';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-presupuesto-list',
  imports: [
    CommonModule,
    HeaderComponent,
    MenuFooterComponent,
    ModalInstruccionesComponent,
    InfiniteScrollModule,
    FormsModule,
    BackButtnComponent,
    LoadingComponent
  ],
  templateUrl: './presupuesto-list.component.html',
  styleUrl: './presupuesto-list.component.scss'
})
export class PresupuestoListComponent {

  pageTitle = 'Presupuestos';
  user!: any;
  presupuestos = signal<Presupuesto[]>([]);
  isLoading = false;
  showToast = signal(false);
  loading = signal<boolean>(false);
  hasMore = signal<boolean>(true);
  isFiltering = signal(false);
  page = 1;
  userId!: string;
  query: string = '';
  status!: string;
  presupuestoSeleccionado = signal<any>(null);

  mostrarMotivo: boolean = false;
motivoRechazo: string = '';
presupuestoTemporal: any = null;

  info = `
  <h2>Sección: Mis Presupuestos</h2>
  <p>En este apartado podrás:</p>
  <ul>
    <li><strong>Consultar el historial</strong> de tus presupuestos, identificados con colores según su estatus (Pendiente, Aprobado o Rechazado).</li>
    <li><strong>Localizar transacciones</strong> rápidamente buscando por fecha, número de referencia o monto.</li>
    <li><strong>Filtrar la lista</strong> para ver solo los presupuestos que te interesen según su estado actual.</li>
    <li><strong>Acceder al detalle</strong> completo de cada operación utilizando el botón "Ver Ticket".</li>
  </ul>`;


  constructor(
    public presupuestoService: PresupuestoService,
    public authService: AuthService,
    public busquedasService: BusquedasService,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.authService.getLocalStorage();
    this.getPresupuestobyuser();
  }

  onScroll(): void {
    if (this.loading() || !this.hasMore()) return;

    // Si hay búsqueda por TEXTO (query), normalmente el backend devuelve todo de golpe.
    // Pero si es por ESTATUS, queremos seguir bajando:
    this.page++;
    this.getPresupuestobyuser();
  }



  getPresupuestobyuser() {
    if (!this.hasMore()) return; // Si ya sabemos que no hay más en el servidor, paramos.
    this.loading.set(true);

    this.presupuestoService.getPrByCliente(this.user.uid, this.page).subscribe({
      next: (newData: any[]) => {
        if (newData.length === 0) {
          this.hasMore.set(false);
          this.loading.set(false);
        } else {
          // 1. Filtrado local por estatus
          let filteredData = newData;
          if (this.status) {
            filteredData = newData.filter(p => p.status === this.status);
          }
          // 2. Agregamos los únicos a la lista visible
          this.presupuestos.update(current => {
            const ids = new Set(current.map(p => p._id));
            const unique = filteredData.filter(p => !ids.has(p._id));
            return [...current, ...unique];
          });

          // 3. LA CLAVE: Si estamos filtrando y trajo muy pocos (ej. menos de 5) 
          // o ninguno, pero el API dice que hay más páginas, pedimos la siguiente YA.
          if (this.status && filteredData.length < 5 && newData.length > 0) {
            this.page++;
            this.getPresupuestobyuser(); // Llamada recursiva controlada
          } else {
            this.loading.set(false);
          }
        }
      },
      error: () => this.loading.set(false)
    });
  }

  search(): void {
    // 1. Resetear estados de paginación cada vez que filtramos
    this.page = 1;
    this.hasMore.set(true);
    this.presupuestos.set([]);

    // CASO A: El usuario escribió algo en el buscador (Texto)
    if (this.query && this.query.trim() !== '') {
      this.isFiltering.set(true);
      this.loading.set(true);

      this.busquedasService.buscar('payments', this.query).subscribe({
        next: (resultados: any[]) => {
          let filtered = resultados;
          // Si además de texto seleccionó un estatus, filtramos el array
          if (this.status) {
            filtered = resultados.filter((p: any) => p.status === this.status);
          }
          this.presupuestos.set(filtered);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }

    // CASO B: No hay texto, pero quizás seleccionó un Estatus (o "Todos")
    else {
      // Si seleccionó un estatus o volvió a "Todos", usamos la carga normal
      // getPresupuestobyuser ahora debe enviar this.status al servicio
      this.isFiltering.set(this.status !== '');
      this.getPresupuestobyuser();
    }
  }


  clearFilters(): void {
    // Vibración y reset de filtros
    if (navigator.vibrate) navigator.vibrate(50);

    this.query = '';
    this.status = '';
    this.isFiltering.set(false);
    this.page = 1;
    this.hasMore.set(true);
    this.presupuestos.set([]);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. ACTIVAR EL TOAST Y PROGRAMAR CIERRE
    this.showToast.set(true);

    setTimeout(() => {
      this.showToast.set(false);
    }, 2500); // Se ocultará solo después de 2.5 segundos

    this.getPresupuestobyuser();
  }

  verDetallePago(presupuesto: any) {
    this.presupuestoSeleccionado.set(presupuesto);

    const el = document.getElementById('offcanvasPago');
    const bsOffcanvas = new bootstrap.Offcanvas(el);
    bsOffcanvas.show();
  }

  onEditProject(presupuesto: Presupuesto) {
    this.presupuestoSeleccionado.set(presupuesto);

  }
  

  cambiarStatus(event: any, presupuesto: any) {
  const nuevoEstado = event.target.value; // Captura lo que seleccionó el usuario
  this.presupuestoTemporal = presupuesto;

  // 1. Caso: Seleccionó RECHAZADO
  if (nuevoEstado === 'REFUSED') {
    this.mostrarMotivo = true;
    this.motivoRechazo = ''; // Limpiamos el campo de texto anterior

  // 2. Caso: Seleccionó APROBADO
  } else if (nuevoEstado === 'APROVED') {
    this.mostrarMotivo = false;
    if (confirm(`¿Estás seguro de marcar como APROBADO este presupuesto?`)) {
      this.ejecutarUpdateStatus(presupuesto._id, nuevoEstado);
    } else {
      this.ngOnInit(); // Recarga o revierte el estado visual si cancela
    }

  // 3. Caso: Seleccionó PENDIENTE
  } else {
    this.mostrarMotivo = false;
    this.ejecutarUpdateStatus(presupuesto._id, nuevoEstado);
  }
}

confirmarRechazo() {
  if (!this.motivoRechazo || this.motivoRechazo.trim() === '') {
    alert('¡Debes escribir un motivo de rechazo!');
    return;
  }

  // Enviamos los datos definitivos al backend
  this.ejecutarUpdateStatus(this.presupuestoTemporal._id, 'REFUSED', this.motivoRechazo);
  this.mostrarMotivo = false;
}

cancelarRechazo() {
  this.mostrarMotivo = false;
  this.ngOnInit(); // Revierte los cambios visuales en el select al estado original
}

  // Función auxiliar para no repetir código del subscribe
  private ejecutarUpdateStatus(id: string, nuevoEstado: string, observaciones: string = '') {
    const payload = {
      status: nuevoEstado,
      observaciones: observaciones // Esto llegará a tu backend para el mensaje del Push/Toastr
    };

    this.presupuestoService.updateStatus(payload, id).subscribe({
      next: (resp) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: nuevoEstado === 'APROVED' ? '✅ Documento Aprobado' : '❌ Documento Rechazado',
          color: 'gray',
          showConfirmButton: false,
          timer: 1500,
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.toastr.error('Error', 'No se pudo actualizar el presupuesto')
        this.ngOnInit();
      }
    });
  }
}
