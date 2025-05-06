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
import Swal from 'sweetalert2';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentmethodService } from '../../services/paymentmethod.service';

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
    RouterModule
  ],
  templateUrl: './especialista.component.html',
  styleUrl: './especialista.component.scss'
})
export class EspecialistaComponent {
  pageTitle= 'Profile';
    public user!: Usuario;

    public isLoading:boolean = false;
    loadingTitle!:string;
    // public profile!: Profile;
    public profile: Profile = new Profile();
    public redessociales!: RedesSociales[];
    public precios!: Precios[];
    public speciality_profile!: Speciality;
    public speciality!: Speciality;
    public solicitud!: Solicitud;
    status!:Profile ;
    role!:Profile ;
    solicitudes_selected: any[] = [];
    toastr: any;
    user_id!: number;
    rating!: number;
    tiposdePagoUser: any[] = [];

    userForm: FormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('',[Validators.required, Validators.minLength(3)]),
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
      private fb: FormBuilder,
      private paymentService: PaymentmethodService,
    ) {
      this.user = this.authService.getUser();
    }
  
    ngOnInit(): void {
      window.scrollTo(0, 0);
      this.activatedRoute.params.subscribe(({ id }) => {
        this.getProfile(id);
      });
      // this.validarFormularioPerfil();
      
    }
  
    getProfile(id:number){
      this.isLoading = true;
      this.loadingTitle = 'Cargando perfil';
      this.profileService.getByUser(id).subscribe((resp:any) => {
        console.log(resp);
        if(resp.status === '404' || resp.ok === false){
          alert('no hay perfil')
          this.isLoading = false;
        }
        this.profile = resp.profile  || [];
        this.rating = resp.profile.rating || 0;
        if(this.profile){

          this.redessociales = typeof resp.profile.redessociales === 'string' 
              ? JSON.parse(resp.profile.redessociales) || []
              : resp.profile.redessociales || [];
  
              this.precios = typeof resp.profile.precios === 'string' 
              ? JSON.parse(resp.profile.precios) || []
              : resp.profile.precios || [];
              
          this.speciality_profile = resp.profile.speciality_id;
          this.user_id = resp.profile.user_id;
          this.isLoading = false;
          this.getSpeciality();
          this.getPaymentMethods();
        }
      })
    }
  
    getSpeciality(){
      this.specialityService.getSpeciality(this.speciality_profile).subscribe((resp:any) => {
        // console.log(resp);
        this.speciality = resp;
      })
    }

    getPaymentMethods(){
      this.paymentService.getPaymentMethodByUserId(this.user_id).subscribe((resp:any) => {
        // console.log(resp);
        this.tiposdePagoUser = resp;
      })
    }

    cambiarStatus(data:any){
      const VALUE = data;
      // console.log(VALUE);

      const datos = {
        "status": VALUE
      }
      this.isLoading = true;
      this.profileService.updateProfileStatus(datos, this.profile.id).subscribe(
        resp =>{
          this.isLoading = false;
          this.ngOnInit();
        }
      )
    }


    solicitarItem(data:any){

      const formData = new FormData();
      formData.append("user_id", this.profile.user_id+'');
      formData.append("client_id", this.user.id+'');
      formData.append("pedido", JSON.stringify(data));
      

      this.solicitudService.createSolicitud(formData).subscribe({
        next: (resp:any) => {
          this.solicitud = resp;
          Swal.fire('Éxito!', 'Solicitud creada correctamente', 'success');
          this.ngOnInit();
        },
        error: (err) => {
          Swal.fire('Error', 'Error al crear la solicitud', 'error');
          console.error(err);
        }
      });
    }

    addFavorite(){
      
    }
}
