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
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { ClientService } from '../../services/client.service';
import { Profile, RedesSociales } from '../../models/profile.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wallet',
  imports: [
    MenuFooterComponent, HeaderComponent,
    CommonModule,
    BackButtnComponent,
    NgFor, TranslateModule,
    InfiniteScrollDirective,
    LoadingComponent, NgIf,
    FormsModule,
    ReactiveFormsModule,
    ImagenPipe
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



  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.authService.getLocalStorage();
    this.rol = this.user.role;
    this.getSolicitudesbyMember();


  }

  getSolicitudesbyMember() {
    this.isLoading = true;
    this.solicitudService.getByUser(this.user.uid).subscribe((resp: any) => {
      this.solicitudes = resp.data;
      this.pedido = typeof resp.pedido === 'string'
        ? JSON.parse(resp.pedido) || []
        : resp.pedido || [];
      this.isLoading = false;


    })
  }


  closeReload() {
    this.pedido_selected = null;
    this.ngOnInit();
  }



  getSolicitudDetail(item: any) {
    this.pedido_selected = item.id;
    this.solicitudService.getSolicitud(this.pedido_selected).subscribe((resp: any) => {
      this.solicitud_users = resp.solicitud_users || [];
      this.client_id = resp.solicitud_users[0].client_id;
      this.user_client_id = resp.solicitud_users[0].user_id;
      // console.log(resp.solicitud_users);
      this.status = resp.solicitud_users[0].status;
      this.getClienteSolicitud()

    })
  }

  getClienteSolicitud() {
    this.clientService.getClient(this.client_id).subscribe((resp: any) => {
      // console.log('respuesta para miembro',resp);
      this.client = resp[0];
      this.profile = resp[0].profile;
      this.client_user_id = resp[0].clients_user[0].id;
    })
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
      this.getSolicitudesbyMember();
    }, 2000);
  }






  solicitudSelected(solicitud: any) {
    this.solicitud_selected = solicitud;
    this.getSolicitudDetail(solicitud);
    this.pedido = typeof solicitud.pedido === 'string'
      ? JSON.parse(solicitud.pedido) || []
      : solicitud.pedido || [];
    // console.log(this.pedido);
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
        Swal.fire('Éxito!', 'Cliente creado correctamente', 'success');
        this.ngOnInit();
      }
      , error: (err) => {
        Swal.fire('Error', 'Error al crear el cliente', 'error');
        console.error(err);
      }
    });
  }

  deleteContact() {
    const formData = new FormData();
    formData.append("client_id", this.client.uid + '');

    this.clientService.removeClient(this.client_id).subscribe({
      next: (resp: any) => {
        this.client = resp;
        Swal.fire('Éxito!', 'client eliminado correctamente', 'success');
        this.ngOnInit();
      }
      , error: (err) => {
        Swal.fire('Error', 'Error al eliminar el client', 'error');
        console.error(err);
      }
    });
  }

}
