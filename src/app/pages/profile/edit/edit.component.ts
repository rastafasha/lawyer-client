import { CommonModule, NgFor } from '@angular/common';
import { Component, Type } from '@angular/core';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Precios, Profile, RedesSociales } from '../../../models/profile.model';
import { Speciality } from '../../../models/speciality.model';
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
import { FileUploadService } from '../../../services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { ImagenPipe } from '../../../pipes/imagen.pipe';

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
    TranslateModule,
    ImagenPipe
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  pageTitle = 'Edit Profile';
  Title!: string;
  public iswhatsapp: boolean = false;
  selectedValueCode = '';

  public isLoading: boolean = false;
  public isLoadingImage: boolean = false;
  loadingTitle!: string;


  public user!: any;
  public user_id!: string;
  public roles!: [];
  public profile_id!: string;
  public speciality_id!: string;
  public gender!: number;
  public profile!: Profile;
  // public redessociales: RedesSociales[] = []; // Initialize as an empty array
  public precios!: Precios;
  // public listIcons: Icons[] = [];
  public speciality!: Speciality;
  public specialities: Speciality[] = [];

  public perfilForm!: FormGroup;
  public profileSeleccionado!: Profile;

  public redssociales: any = [];
  public tarifas: any = [];
  description: any;
  item_tarifa: any;
  usuario_red: any;
  name_red: any;
  icono: any;
  precio: number = 0;
  cantidad: number = 0;
  amount = 0;

  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = "assets/img/user-06.jpg";

  public imagenSubir!: File;
  public imgTemp: any = null;
  text_validation: any = null;
  iconoSeleccionado: any;

  public paises: Pais[] = [];

  langs: string[] = [];
  public activeLang = 'es';
  flag = false;
  lang!: string;


  public listIcons = [
    { icon: 'fa-facebook', name: 'Facebook' },
    { icon: 'fa-instagram', name: 'Instagram' },
    { icon: 'fa-twitter', name: 'Twitter' },
    { icon: 'fa-youtube', name: 'YouTube' },
    { icon: 'fa-linkedin', name: 'LinkedIn' },
    { icon: 'fa-github', name: 'Github' },
    { icon: 'fa-whatsapp', name: 'Whatsapp' },
    { icon: 'fa-skype', name: 'Skype' },
    { icon: 'fa-pinterest', name: 'Pinterest' },
    { icon: 'fa-twitch', name: 'Twitch' },
    { icon: 'fa-telegram', name: 'Telegram' },
    { icon: 'fa-discord', name: 'Discord' },
    { icon: 'fa-reddit', name: 'Reddit' },
    { icon: 'fa-medium', name: 'Medium' },
    { icon: 'fa-snapchat', name: 'Snapchat' },
    { icon: 'fa-yahoo', name: 'Yahoo' },
    { icon: 'fa-steam', name: 'Steam' },
  ]

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private specialityService: SpecialitiesService,
    public paisService: PaisService,
    private fileUploadService: FileUploadService,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {
    this.user = this.authService.getLocalStorage();
  }



  ngOnInit(): void {
    window.scrollTo(0, 0);
    // this.closeMenu();
    this.user_id = this.user.uid;
    this.validarFormularioPerfil();

    this.getSpecialitys();
    this.getPaisesList();
    this.activatedRoute.params.subscribe(({ id }) => this.iniciarFormularioPerfil(id));
    this.Title = this.user.username;

  }

  getPaisesList(): void {
    this.paisService.getPaises().subscribe(
      (res: any) => {
        this.paises = res.paises;
      }
    );
  }

  getSpecialitys() {
    this.specialityService.getSpecialitys().subscribe((resp: Speciality[]) => {
      this.specialities = resp;
    });
  }

  validarFormularioPerfil() {
    this.perfilForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      pais: [''],
      lang: [''],
      n_doc: [''],
      gender: [''],
      estado: [''],
      ciudad: [''],
      direccion: [''],
      telhome: ['', Validators.required],
      telmovil: ['', Validators.required],
      shortdescription: ['', Validators.required],
      redssociales: [''],
      especialidad: [''],
      precios: [''],
      usuario: [this.user.uid],
      id: [''],
    });
  }


  iniciarFormularioPerfil(id: string) {
    if (!id == null || !id == undefined || id) {
      this.profileService.getByUser(id).subscribe(
        (res: any) => {
          this.perfilForm.patchValue({
            _id: res.profile._id,
            first_name: res.profile.first_name,
            last_name: res.profile.last_name,
            direccion: res.profile.direccion,
            pais: res.profile.code,
            lang: res.profile.lang,
            n_doc: res.profile.n_doc,
            gender: res.profile.gender,
            estado: res.profile.estado,
            ciudad: res.profile.ciudad,
            telhome: res.profile.telhome,
            telmovil: res.profile.telmovil,
            shortdescription: res.profile.shortdescription,
            redssociales: res.profile.redssociales,
            especialidad: res.profile.especialidad,
            precios: res.profile.precios,
            usuario: this.user.uid,
            img: res.profile.img
          });
          this.profileSeleccionado = res.profile;
        }

      );
    } else {
      this.pageTitle = 'Crear Perfil';
    }



  }




  addRedSocial() {
    if (this.usuario_red && this.name_red) {
      this.redssociales.push({
        usuario_red: this.usuario_red,
        name_red: this.name_red,
        icono: this.icono,
      });
      this.usuario_red = '';
      this.name_red = '';
      this.icono = '';

    }
  }

  deletered(i: any) {
    this.redssociales.splice(i, 1);
    this.usuario_red = '';
    this.name_red = '';
    this.icono = '';

  }

  onPaServiceSelect(event: any) {
    const ic = event;
    this.iswhatsapp = false;
    if (ic === 'fa fa-whatsapp') {
      this.selectedValueCode = ic;
      this.iswhatsapp = true;
    }
  }


  addTarifa() {
    if (this.item_tarifa && this.precio) {
      this.tarifas.push({
        item_tarifa: this.item_tarifa,
        precio: this.precio,
      });
      this.item_tarifa = '';
      this.precio = 0;

    }
  }

  deleteTarifa(i: any) {
    this.tarifas.splice(i, 1);
    this.item_tarifa = '';
    this.precio = 0;

  }



  cambiarImagen(event: any): void {
    const file: File = event.target.files[0];
    this.imagenSubir = file;

    if (!file) {
      this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.isLoadingImage = true
    const profileId = this.profileSeleccionado?._id;
    if (!profileId) {
      return;
    }

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'profiles', profileId)
      .then(img => {
        this.profileSeleccionado.img = img;
        this.isLoadingImage = false;
        this.toastr.success('Guardado', 'La imagen fue actualizada')
      }).catch(err => {
        this.isLoadingImage = false;
        this.toastr.error('Error', 'No se pudo subir la imagen')
      })
    this.ngOnInit();
  }



  onUserSave() {
    if (!this.perfilForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.perfilForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    const data: any = {
      usuario: this.user.uid,
      first_name: this.perfilForm.value.first_name,
      last_name: this.perfilForm.value.last_name,
      direccion: this.perfilForm.value.direccion || null,
      shortdescription: this.perfilForm.value.shortdescription || null, // Nombre correcto de tu esquema
      pais: this.perfilForm.value.pais || null,
      ciudad: this.perfilForm.value.ciudad || null,
      telhome: this.perfilForm.value.telhome || null,
      telmovil: this.perfilForm.value.telmovil || null,             // Nombre correcto de tu esquema
      n_doc: this.perfilForm.value.n_doc || null,
      gender: this.perfilForm.value.gender || null,
      especialidad: this.perfilForm.value.especialidad || null,   // Nombre correcto de tu esquema
      lang: this.lang || null,

      // Forzamos el envío de tus variables globales de arreglos
      redssociales: this.redssociales || [],
    };



    if (this.profileSeleccionado) {
      data._id = this.profileSeleccionado._id;

      this.profileService.updateProfile(data, this.profileSeleccionado._id).subscribe((resp: any) => {
        this.profileSeleccionado = resp;
        this.toastr.success('Exito!', 'Se ha actualizado la data')
        this.ngOnInit();
      });
    } else {

      this.profileService.createProfile(data).subscribe((resp: any) => {
        this.profileSeleccionado = resp;
        this.toastr.success('Exito!', 'Se ha creado la data')
        this.ngOnInit();
      });
    }

  }

  public cambiarLenguaje(lang: any) {
    this.activeLang = lang;
    this.translate.use(lang);
    this.flag = !this.flag;
    localStorage.setItem('lang', this.activeLang);
    this.perfilForm.patchValue({ lang: lang });
  }


}
