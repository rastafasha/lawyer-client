import { Component } from '@angular/core';
import { Precios, Profile, RedesSociales } from '../../models/profile.model';
import { Speciality } from '../../models/speciality.model';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { SpecialitiesService } from '../../services/specialities.service';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudesService } from '../../services/solicitudes.service';
import { Solicitud } from '../../models/solicitud.model';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentmethodService } from '../../services/paymentmethod.service';
import { FavoritesService } from '../../services/favorites.service';
import { ToastrService } from 'ngx-toastr';
import { RatingStarComponent } from '../../components/ratingStar/ratingStar.component';

@Component({
  selector: 'app-especialista',
  imports: [
    CommonModule,
    HeaderComponent,
    MenuFooterComponent,
    LateralComponent,
    BackButtnComponent,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    ImagenPipe,
    LoadingComponent,
    TranslateModule,
    RouterModule,
    RatingStarComponent
  ],
  templateUrl: './especialista.component.html',
  styleUrl: './especialista.component.scss'
})
export class EspecialistaComponent {
  pageTitle = 'Profile';
  public user!: any;

  public isLoading: boolean = false;
  loadingTitle!: string;
  // public profile!: Profile;
  public profile!: Profile;
  public redessociales!: RedesSociales[];
  public precios!: Precios[];
  public speciality_profile!: Speciality;
  public speciality!: any;
  public solicitud!: Solicitud;
  status!: Profile;
  role!: Profile;
  solicitudes_selected: any[] = [];
  user_id!: any;
  client_id!: string;
  imagen!: any;
  profile_id?: string;
  rating!: number;
  tiposdePagoUser: any[] = [];

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    userName: new FormControl('', [Validators.email, Validators.required]),
    city: new FormControl(''),
    state: new FormControl('Caracas'),
    zipCode: new FormControl(''),
    isAgree: new FormControl(false),

  });


  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private specialityService: SpecialitiesService,
    private solicitudService: SolicitudesService,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentmethodService,
    private toastr: ToastrService,
  ) {
    this.user = this.authService.getLocalStorage();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.client_id = this.user.uid;
    this.activatedRoute.params.subscribe(({ id }) => {
      this.getProfile(id);
    });
  }

  getProfile(id: number) {
    this.isLoading = true;
    this.loadingTitle = 'Cargando perfil';
    this.profileService.getByUser(id).subscribe((resp: any) => {
      if (resp.status === '404' || resp.ok === false) {
        alert('no hay perfil')
        this.isLoading = false;
      }
      this.profile = resp.profile || [];
      this.profile_id = this.profile._id;
      this.user_id = this.profile.usuario?.uid;
      this.speciality = this.profile.especialidad?.nombre;
      this.imagen = this.profile.img;
      this.rating = resp.profile.rating || 0;
      if (this.profile) {

        this.redessociales = typeof resp.profile.redessociales === 'string'
          ? JSON.parse(resp.profile.redessociales) || []
          : resp.profile.redessociales || [];

        this.precios = typeof resp.profile.precios === 'string'
          ? JSON.parse(resp.profile.precios) || []
          : resp.profile.precios || [];

        this.speciality_profile = resp.profile.especialidad;

        this.isLoading = false;
        this.getPaymentMethods();
      }
    })
  }

  

  getPaymentMethods() {
    this.paymentService.getByUser(this.user_id).subscribe((resp: any) => {
      this.tiposdePagoUser = resp;
    })
  }

  cambiarStatus(data: any) {
    const VALUE = data;

    const datos = {
      "status": VALUE
    }
    this.isLoading = true;
    // this.profileService.updateProfileStatus(datos, this.profile_id).subscribe(
    //   resp =>{
    //     this.isLoading = false;
    //     this.ngOnInit();
    //   }
    // )
  }


  solicitarItem(data: any) {

    const datos: any = {
      usuario: this.user_id,
      cliente: this.client_id,
      pedido: data
    }

    this.solicitudService.createSolicitud(datos).subscribe({
      next: (resp: any) => {
        this.solicitud = resp;
        this.toastr.success('Éxito!', 'Solicitud creada correctamente')
        this.ngOnInit();
      },
      error: (err) => {
        this.toastr.error('Error', 'Error al crear la solicitud')
        console.error(err);
      }
    });
  }

  addToFavorites() {
    // const data = {
    //   usuario: usuario._id,
    //   usuario: this.usuario.uid,
    // }

    // this.favoriteService.createFavorite(data).subscribe({
    //   next: (res: any) => {
    //     this.favoriteItem = res;
    //     this.toastr.success('¡Añadido a favoritos!');
    //     this.esFavorito = true;
    //     this.favoriteService.triggerRefresh();
    //     this.ngOnInit();
    //   },
    //   error: (err) => {
    //     console.log('Error completo:', err);
    //     // Aquí capturamos el error del backend
    //     // Si el backend envió res.status(400), el mensaje está en err.error.msg
    //     const mensaje = err.error?.msg || 'Error al guardar';
    //     // this.toastr.warning(mensaje, 'Atención');
    //   }
    // });
  }
}
