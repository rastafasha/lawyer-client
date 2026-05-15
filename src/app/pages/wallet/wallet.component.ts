import { Component, inject } from '@angular/core';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { Solicitud, SolicitudesUsers } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/usuario.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Profile, RedesSociales } from '../../models/profile.model';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;
@Component({
  selector: 'app-wallet',
  imports: [
    MenuFooterComponent,
    HeaderComponent,
    CommonModule,
    BackButtnComponent,
    NgFor, TranslateModule,
    InfiniteScrollDirective,
    LoadingComponent, NgIf,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent {
  pageTitle = 'Solicitudes';

  loadingTitle!: string;
  isRefreshing = false;
  isLoading = false;
  isEdnOfList = false;

  public user!: any;
  public client!: Usuario;
  public rol?: string;
  public solicitudes: Solicitud[] = [];
  public solicitud_users: SolicitudesUsers[] = [];
  public user_client_id!: string;
  public user_member_id!: string;
  public client_id!: string;
  public client_user_id!: string;
  public pedido: any = [];
  public clients: any = [];

  option_selected: number = 1;
  solicitud_selected: any = null;
  client_selected: any = null;
  pedido_selected: any;
  status!: Profile;
  profile!: Profile;

  public text_success = '';
  public text_validation = '';

  public redessociales!: RedesSociales[];

  private solicitudService = inject(SolicitudesService);
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private toastr = inject(ToastrService);



  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.authService.getLocalStorage();
    this.rol = this.user.role;
    this.getSolicitudesbyClient();
  }

  getSolicitudesbyClient() {
    this.isLoading = true;
    this.solicitudService.getByUser(this.user.uid).subscribe((resp: any) => {
      this.solicitudes = resp;
      this.isLoading = false;
    })
  }


  closeReload() {
    this.pedido_selected = null;
    this.ngOnInit();
  }

  solicitudSelected(solicitud: any) {
    this.solicitud_selected = solicitud;
  }

  abrirDetalle(item: any) {
    this.solicitud_selected = item;
    // 1. Abrir Offcanvas
    const el = document.getElementById('offcanvasNotif');
    const bsOffcanvas = new bootstrap.Offcanvas(el);
    bsOffcanvas.show();
  }

  reportarPago(id: string) {
    // 1. Obtenemos la factura completa del Signal
    const facturaCompleta = this.solicitud_selected;

    if (!facturaCompleta) {
      this.toastr.error('Error al recuperar los datos de la factura');
      return;
    }

    // 2. Cerramos el Offcanvas (Bootstrap)
    const element = document.getElementById('offcanvasDetalle');
    if (element) {
      const bsOffcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(element);
      if (bsOffcanvas) bsOffcanvas.hide();
    }

    // 3. ¡ESTA ES LA PARTE CLAVE! Enviamos el ID y el STATE
    this.router.navigate(['/reportar-pago', id], {
      state: { factura: facturaCompleta } // <--- Aquí viaja el monto, nroFactura, etc.
    });
  }





  onScrollDown() {
    // if (!this.nextUrl || this.isLoading) return;
    // this.favoriteService.getCharacters(this.nextUrl).subscribe({
    //   next: (resp: any) => {
    //     if (resp.info.next) {
    //       this.nextUrl = resp.info.next;
    //       this.characters = [...this.characters, ...resp.results];
    //     } else {
    //       this.isEdnOfList = true;
    //       this.loadingTitle = 'No hay más personajes para mostrar';
    //       alert('ultima pagina');
    //     }
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //   }
    // });
  }

  onScrollUp() {
    this.refreshData();
  }



  refreshData() {
    this.isRefreshing = true;
    // Simulate data fetching 
    setTimeout(() => {
      this.isRefreshing = false;
      // Update your data here 
      this.getSolicitudesbyClient();
    }, 2000);
  }


  cambiarStatus(status: any) {
    console.log(status);
    const data = {
      status: status,
      pedido: this.pedido
    }

    this.solicitudService.updateSolicitudStatus(data, this.solicitud_selected.id).subscribe((resp: any) => {

      this.solicitud_selected = null
      this.ngOnInit();
    })

  }

  addClient() {
    const formData = new FormData();
    formData.append("client_id", this.client.uid + '');
    formData.append("user_id", this.user.uid + '');

    this.clientService.addClienttoUser(formData).subscribe({
      next: (resp: any) => {
        this.client = resp;
        this.toastr.success('Éxito!', 'Cliente creado correctamente')
        this.ngOnInit();
      }
      , error: (err) => {
        this.toastr.error('Error', 'Error al crear el cliente')
        console.error(err);
      }
    });
  }

 deleteContact(client_id: any) {
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
        this.clientService.removeClient(client_id).subscribe(
          response => {
            this.ngOnInit();
          }
        )
        Swal.fire(
          'Borrado!',
          'El client fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });
  }


  

}
