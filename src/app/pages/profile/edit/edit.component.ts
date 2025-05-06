import { CommonModule, NgFor } from '@angular/common';
import { Component, Type } from '@angular/core';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Precios, Profile, RedesSociales } from '../../../models/profile.model';
import { Speciality } from '../../../models/speciality.model';
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecialitiesService } from '../../../services/specialities.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaisService } from '../../../services/pais.service';
import { Pais } from '../../../models/pais';
import { PlacesService } from '../../../services/places.service';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    HeaderComponent,
        MenuFooterComponent, 
        BackButtnComponent,
        ReactiveFormsModule,
        FormsModule,
        NgFor,
        LoadingComponent,
        TranslateModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  pageTitle= 'Edit Profile';
  Title!:string;
  public iswhatsapp : boolean = false;
  selectedValueCode = '';
  

  public isLoading:boolean = false;
    loadingTitle!:string;

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('',[Validators.required, Validators.minLength(3)]),
    userName: new FormControl('', [Validators.email, Validators.required]),
    city: new FormControl(''),
    state: new FormControl('Caracas'),
    zipCode: new FormControl(''),
    isAgree: new FormControl(false),

    });

  public user!: Usuario;
  public user_id!: number;
  public roles!: [];
  public profile_id!: number;
  public speciality_id!: number;
  public gender!: number;

    // public profile!: Profile;
    public profile: Profile = new Profile();
    // public redessociales: RedesSociales[] = []; // Initialize as an empty array
    public precios!: Precios;
    // public listIcons: Icons[] = [];
    public speciality!: Speciality;
    public specialities: Speciality [] = [];

    public perfilForm!: FormGroup;
    public profileSeleccionado!: Profile;

    public redessociales: any = [];
    public tarifas: any = [];
    description:any;
    item_tarifa:any;
    title:any;
    url:any;
    icono:any;
    precio:number = 0;
    cantidad:number = 0;
    amount = 0;

    public FILE_AVATAR: any;
    public IMAGE_PREVISUALIZA: any = "assets/img/user-06.jpg";
    text_validation: any = null;
    iconoSeleccionado:any;

    public paises :Pais[] = [];

    langs: string[] = [];
  public activeLang = 'es';
  flag = false;
  lang!:string;
    

    public listIcons = [
      { icon: 'fa fa-facebook', name: 'Facebook' },
      { icon: 'fa fa-instagram', name: 'Instagram' },
      { icon: 'fa fa-twitter', name: 'Twitter' },
      { icon: 'fa fa-youtube', name: 'YouTube' },
      { icon: 'fa fa-linkedin', name: 'LinkedIn' },
      { icon: 'fa fa-github', name: 'Github' },
      { icon: 'fa fa-whatsapp', name: 'Whatsapp' },
      { icon: 'fa fa-skype', name: 'Skype' },
      { icon: 'fa fa-pinterest', name: 'Pinterest' },
      { icon: 'fa fa-twitch', name: 'Twitch' },
      { icon: 'fa fa-telegram', name: 'Telegram' },
      { icon: 'fa fa-discord', name: 'Discord' },
      { icon: 'fa fa-reddit', name: 'Reddit' },
      { icon: 'fa fa-medium', name: 'Medium' },
      { icon: 'fa fa-snapchat', name: 'Snapchat' },
      { icon: 'fa fa-yahoo', name: 'Yahoo' },
      { icon: 'fa fa-steam', name: 'Steam' },
    ]
  
    constructor(
      private authService: AuthService,
      private activatedRoute: ActivatedRoute,
      private profileService: ProfileService,
      private fb: FormBuilder,
      private specialityService: SpecialitiesService,
      public paisService: PaisService,
      private placesServices: PlacesService,
      private translate: TranslateService,
    ) {
      this.user = this.authService.getUser();
    }
  
    

    ngOnInit(): void {
      window.scrollTo(0,0);
      // this.closeMenu();
      this.user_id = this.user.id;
      this.validarFormularioPerfil();
      
      // this.getSpecialitys();
      this.getPaisesList();
      this.activatedRoute.params.subscribe( ({id}) => this.iniciarFormularioPerfil(id));
      this.Title = this.user.username;
      
    }

    getPaisesList(): void {
      this.paisService.getPaises().subscribe(
        (res:any) =>{
          this.paises = res.paises;
          console.log(res);
        }
      );
    }

    getProfile(){
      this.isLoading = true;
      this.loadingTitle = 'Cargando perfil';
      this.profileService.getByClient(this.user.id).subscribe(
        (resp:any) => {
          // console.log('Profile response:', resp); // Log the response
          this.profile = resp.profile;
          this.redessociales = typeof resp.profile.redessociales === 'string' 
            ? JSON.parse(resp.profile.redessociales) || []
            : resp.profile.redessociales || [];
          this.tarifas = typeof resp.profile.precios === 'string'
            ? JSON.parse(resp.profile.precios) || []
            : resp.profile.precios || [];
          this.profile_id = resp.profile.id;
          this.IMAGE_PREVISUALIZA = resp.profile.avatar;
          this.FILE_AVATAR = resp.profile.avatar;
          // this.gender = resp.profile.gender
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching profile:', error); // Log any errors
        }
      );
    }



  iniciarFormularioPerfil(id:string){
    if (!id == null || !id == undefined || id) {
      this.profileService.getByClient(id).subscribe(
        (res:any) => {
          this.userForm.patchValue({
            id: res.id,
            nombre: res.profile.nombre,
            surname: res.profile.surname,
            
            direccion: res.profile.direccion,
            description: res.profile.description,
            pais: res.profile.pais,
            lang: res.profile.lang,
            estado: res.profile.estado,
            ciudad: res.profile.ciudad,
            gender: res.profile.gender,
            n_doc: res.profile.n_doc,
            telhome: res.profile.telhome,
            telmovil: res.profile.telmovil,
            speciality_id: res.profile.speciality_id,
            usuario: this.user.id,
          });
          this.profileSeleccionado = res.profile;
          // console.log('profileSeleccionado',this.profileSeleccionado);
          this.getProfile();
        }

      );
    } else {
      this.pageTitle = 'Crear Perfil';
    }



  }

  validarFormularioPerfil(){
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      surname: ['', Validators.required],
      pais: [''],
      estado: [''],
      ciudad: [''],
      telhome: ['', Validators.required],
      telmovil: ['', Validators.required],
      speciality_id: ['', Validators.required],
      direccion: [''],
      n_doc: [''],
      lang: [''],
      gender: [''],
      description: ['', Validators.required],
      usuario: [this.user.id],
      id: [''],
    });
  }


  addRedSocial() {
    if (this.title && this.url ) {
      this.redessociales.push({
        title: this.title,
        url: this.url,
        icono: this.icono,
      });
      this.title = '';
      this.url = '';
      this.icono = '';
      
    }
  }

  deletered(i:any){
    this.redessociales.splice(i,1);
    this.title = '';
    this.url = '';
    this.icono = '';
    
  }


  addMedicamento() {
    if (this.item_tarifa && this.precio > 0) {
      this.tarifas.push({
        item_tarifa: this.item_tarifa,
        cantidad: this.cantidad+'',
        precio: this.precio+''
      });
      this.item_tarifa = '';
      this.precio = 0;
      this.cantidad = 0;
      this.amount = 0;
      
    }
    this.amount = 0;
    for (let i = 0; i < this.tarifas.length; i++) {
      this.amount += parseFloat(this.tarifas[i].precio) * parseFloat(this.tarifas[i].cantidad);
    }
  }

  deleteMedical(i:any){
    this.tarifas.splice(i,1);
    this.item_tarifa = '';
    this.precio = 0;
    this.amount = 0;
    this.cantidad = 0;
    
    if(this.tarifas.length === 0){
      this.item_tarifa = '';
      this.precio = 0;
      this.cantidad = 0;
      this.amount = 0;
    }
  }

  loadFile($event: any) {
    if ($event.target.files[0].type.indexOf("image")) {
          this.text_validation = "Solamente pueden ser archivos de tipo imagen";
          return;
        }
        this.text_validation = "";
        this.FILE_AVATAR = $event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.FILE_AVATAR);
        reader.onloadend = () => (this.IMAGE_PREVISUALIZA = reader.result);
  }

 onPaServiceSelect(event: any) {
    const ic = event;
    this.iswhatsapp = false;
    if (ic === 'fa fa-whatsapp') {
      this.selectedValueCode = ic;
      this.iswhatsapp = true;
    }
  }


  onUserSave(){

    const formData = new FormData();
    formData.append("nombre", this.userForm.value.nombre);
    formData.append("surname", this.userForm.value.surname);
    // formData.append("usuario", this.user.id+'');
    formData.append("client_id", this.user.id+'');
    formData.append("profile_id", this.profile_id+'');
    if (this.userForm.value.direccion) {
      formData.append("direccion", this.userForm.value.direccion);
      
    }
    if (this.userForm.value.description) {
      formData.append("description", this.userForm.value.description);
      
    }
    if (this.userForm.value.pais) {
      formData.append("pais", this.userForm.value.pais);
      
    }
    
    if (this.userForm.value.estado) {
      formData.append("estado", this.userForm.value.estado);
      
    }
    if (this.userForm.value.ciudad) {
      formData.append("ciudad", this.userForm.value.ciudad);
      
    }
    if (this.userForm.value.telefono) {
      formData.append("telefono", this.userForm.value.telefono);
      
    }
    if (this.userForm.value.telhome) {
      formData.append("telhome", this.userForm.value.telhome);
      
    }
    if (this.userForm.value.celular) {
      formData.append("celular", this.userForm.value.celular);
      
    }
    
    if (this.userForm.value.n_doc) {
      formData.append("n_doc", this.userForm.value.n_doc);
      
    }
    if (this.userForm.value.gender) {
      formData.append("gender", this.userForm.value.gender);
      
    }
    if (this.userForm.value.speciality_id) {
      formData.append("speciality_id", this.userForm.value.speciality_id);
      
    }
    if (this.redessociales) {
      // formData.append("redessociales", this.redessociales);
      formData.append("redessociales", JSON.stringify(this.redessociales));
      
    }
    // if (this.tarifas) {
    //   // formData.append("precios", this.tarifas);
    //   formData.append("precios", JSON.stringify(this.tarifas));

    // }
    if (this.FILE_AVATAR) {
      formData.append("imagen", this.FILE_AVATAR);
    }
    if (this.lang) {
      formData.append("lang", this.FILE_AVATAR);
    }

    if(this.profile_id){
      this.profileService.updateProfile( formData, this.profile_id).subscribe((resp:any) => {
        console.log(resp);
        this.profileSeleccionado = resp;
        // this.router.navigate(['/profile']);
        Swal.fire('Exito!', 'Se ha actualizado la formData', 'success');
        this.ngOnInit();
      });
    }else{
      this.profileService.createProfile(formData).subscribe((resp:any) => {
        console.log(resp);
        this.profileSeleccionado = resp;
        Swal.fire('Exito!', 'Se ha creado la data', 'success');
        // this.router.navigate(['/profile']);
        this.ngOnInit();
        });
    }

  }

  public cambiarLenguaje(lang:any) {
    this.activeLang = lang;
    this.translate.use(lang);
    this.flag = !this.flag;
    localStorage.setItem('lang', this.activeLang);
    this.userForm.patchValue({ lang: lang });
  }

}
