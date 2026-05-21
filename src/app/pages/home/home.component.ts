import { Component, HostListener, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { CategoriaHorizontalComponent } from '../../components/categoria-horizontal/categoria-horizontal.component';
import { SliderHorizontalComponent } from '../../components/slider-horizontal/slider-horizontal.component';
import { ListProductsComponent } from '../../components/list-products/list-products.component';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { ListProductsHComponent } from '../../components/list-products-h/list-products-h.component';
import { CommonModule } from '@angular/common';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { ListaUsuariosComponent } from '../../components/ListaUsuarios/ListaUsuarios.component';
import { UserService } from '../../services/usuario.service';
import { Profile } from '../../models/profile.model';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { PushNotificationService } from '../../services/push-notification.service';
import { ModalInstruccionesComponent } from '../../components/modal-instrucciones/modal-instrucciones.component';
import { PwaNotifInstallerComponent } from "../../shared/pwa-notif-installer/pwa-notif-installer.component";

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    MenuFooterComponent,
    AvisoComponent,
    CategoriaHorizontalComponent,
    SliderHorizontalComponent,
    ListProductsComponent,
    LateralComponent,
    CommonModule,
    BackButtnComponent,
    // ListaUsuariosComponent,
    TranslateModule,
    ModalInstruccionesComponent,
    PwaNotifInstallerComponent
],
  providers: [TranslateService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  pageTitle = 'Home';
  user!: any;
  user_id!:string;
  profile!: Profile;
  isLoading = false;

  private translate = inject(TranslateService);
  public pushService = inject(PushNotificationService);
  public toastr = inject(ToastrService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);

    info = `
  <h2>Sección: Inicio</h2>
  <p>En este apartado podrás:</p>
  <ul>
    <li><strong>Encontrar Especialistas por categoria</strong></li>
    <li><strong>Ver tus Solicitudes Recientes</strong></li>
    <li><strong>Ver tus Pagos Recientes</strong> </li>
  </ul>`;
  
  
  constructor(
  ){
    this.user = this.authService.getLocalStorage();
    this.translate.use('es'); // Set default language
  }

  ngOnInit(){
    window.scrollTo(0, 0);
    this.user_id = this.user.uid;
    this.getClienteProfile();
  }

  getClienteProfile(){
    
    this.profileService.getByUser(this.user_id).subscribe((resp:any) => {
      // console.log(resp);
      this.profile = resp.profile || null;
    })
  }

  searchData(){
    this.router.navigateByUrl('/search');
  }
   btnActivarPush() {
    this.pushService.subscribeToNotifications();
  }

}
