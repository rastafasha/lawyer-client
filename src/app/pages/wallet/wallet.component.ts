import { Component, inject } from '@angular/core';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LateralComponent } from '../../components/lateral/lateral.component';
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
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-wallet',
  imports: [
    MenuFooterComponent, HeaderComponent,
    CommonModule, RouterLink, 
    // LateralComponent,
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
  pageTitle='Agenda';

  loadingTitle!:string;
  isRefreshing = false;
  isLoading = false;
  isEdnOfList = false;

  public user!: Usuario;
  public cliente!: Usuario;
  public rol?:string;
  public solicitudes: Solicitud[]=[];
  public solicitud_users: SolicitudesUsers[]=[];
  public user_cliente_id!: number;
  public user_member_id!: number;
  public cliente_id!: any;
  public pedido: any = [];
  public clientes: any = [];
  profile!:Profile;
  option_selected:number = 1;
  solicitud_selected:any = null;
  status!:number ;

  pedido_selected:any;
  public text_success = '';
  public text_validation = '';

  private solicitudService = inject(SolicitudesService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private clientService = inject(ClientService);

  

  ngOnInit(){
    window.scrollTo(0, 0);
    this.user = this.authService.getUser();
    this.rol = this.user.roles[0];
    console.log(this.rol);
    
    this.getSolicitudesbyGuest();
    
    
  }

  

  getSolicitudesbyGuest(){
    this.solicitudService.getByGuest(this.user.id).subscribe((resp:any)=>{
      this.solicitudes = resp;
      this.pedido = typeof resp.pedido === 'string' 
            ? JSON.parse(resp.pedido) || []
            : resp.pedido || [];
      // console.log('respuesta de invitado',resp);
    })
  }

  closeReload(){
    this.pedido_selected = null;
    this.ngOnInit();
  }

  

  getSolicitudDetail(item:any){
    this.pedido_selected = item.id;
    this.solicitudService.getSolicitud(this.pedido_selected).subscribe((resp:any)=>{
      
      this.solicitud_users = resp.solicitud_users || [];
      this.cliente_id = resp.solicitud_users[0].cliente_id;
      this.user_cliente_id = resp.solicitud_users[0].user_id;
      
      this.getClienteSolicitud() 
     
      
    })
  }

  getClienteSolicitud(){
    
    if(this.user_cliente_id){
      this.userService.showUser(this.user_cliente_id).subscribe((resp:any)=>{
        // console.log('respuesta para guest',resp);
        this.cliente = resp.user[0];
        this.profile = resp.user[0].profile;

        // this.status = resp.status;
        // console.log(this.cliente);
      })
    }
  }

  

  onScrollDown(){
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

  onScrollUp(){
    this.refreshData(); 
  }



    refreshData() { 
      this.isRefreshing = true; 
      // Simulate data fetching 
      setTimeout(() => { 
        this.isRefreshing = false; 
        // Update your data here 
        this.getSolicitudesbyGuest();
      }, 2000); 
    }

    optionSelected(value:number){
      this.option_selected = value;
      if(this.option_selected === 1){

        this.ngOnInit();
      }
      if(this.option_selected === 2){
        this.solicitud_selected = null;
        // console.log('pidiendo clientes');
        this.user_member_id = this.user.id;
        this.user_cliente_id = this.user.id;
        // this.getClientesbyuser();
        
        if(this.rol === 'GUEST'){
          this.getContactosbyCliente();
        }
      }
    }

    
    getContactosbyCliente(){
      this.isLoading = true;
      this.clientService.getByContactosCliente(this.user.id).subscribe((resp:any)=>{
        // console.log('contactos',resp);
        this.clientes = resp.users;
        this.isLoading = false;
        
        
        // console.log(this.pedido);
      })
    }

    solicitudSelected(solicitud:any){
      this.solicitud_selected = solicitud;
      this.getSolicitudDetail(solicitud);
      console.log(solicitud);
      // this.pedido = this.solicitud_selected.pedido;
      this.pedido = typeof solicitud.pedido === 'string' 
      ? JSON.parse(solicitud.pedido) || []
      : solicitud.pedido || [];
      console.log(this.pedido);
    }

    cambiarStatus(pedido:any, status:any){debugger
      console.log(pedido);
      console.log(status);
      if(status === false){
        this.solicitud_selected.status = 1;
      }
      if(status === true){
        this.solicitud_selected.status = 2;
      }

      const data ={
        // id:this.solicitud_selected.id,
        status: this.solicitud_selected.status,
        pedido: this.pedido
      }
      
      this.solicitudService.updateSolicitudStatus(data, this.solicitud_selected.id).subscribe((resp:any)=>{
        console.log(resp);
      })
      
    }
    // cambiarStatus(status:any){
    //   if(status === false){
    //     this.solicitud_selected.status = 1;
    //   }
    //   if(status === true){
    //     this.solicitud_selected.status = 2;
    //   }
    //   console.log(status);
    //   this.solicitudService.updateSolicitudStatus(this.solicitud_selected.status).subscribe((resp:any)=>{
    //     console.log(resp);
    //   })
      
    // }
}
