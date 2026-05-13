import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { ModalCondicionesComponent } from '../../components/modal-condiciones/modal-condiciones.component';
import { NgIf } from '@angular/common';
import { PwaNotifInstallerComponent } from '../../shared/pwa-notif-installer/pwa-notif-installer.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlacesService } from '../../services/places.service';
declare const gapi: any;


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ModalCondicionesComponent,
    NgIf, TranslateModule,
    PwaNotifInstallerComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name = new FormControl();
  username = new FormControl();
  email = new FormControl();
  password = new FormControl();
  confirmPassword = new FormControl();
  role = new FormControl();
  n_doc = new FormControl();
  remember = new FormControl();
  terminos = new FormControl();

  loginForm!: FormGroup;
  submitted = false;
  loginError!: string;
  error = null;
  public auth2: any;
  user!: Usuario;

  // Registro
  public formSumitted = false;
  public isLoading = false;

  // Registro
  errors: any = null;
  registerForm!: FormGroup;
  langs: string[] = [];
  public activeLang = 'es';
  public currentStep: number = 1;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    // private placesServices: PlacesService

  ) {

    // this.translate.setDefaultLang('es');
    this.translate.setDefaultLang(this.activeLang);
    this.translate.use('es');
    this.translate.addLangs(["es", "en"]);
    this.langs = this.translate.getLangs();
    translate.get(this.langs).subscribe(res => {
      console.log(res);
    })
    // console.log(this.translate);
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      terminos: [false, Validators.required],

    }, {
      validators: this.passwordsIguales('password', 'password2')

    });
  }

  ngOnInit() {

    const lang = localStorage.getItem('lang');
    if (lang) {
      this.activeLang = lang;
      this.translate.use(lang);
    }

    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]

    });
    this.authService.getLocalStorage();

  }


  login() {
    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe(
      resp => {
        localStorage.setItem('estaAutenticado', 'true');
        this.authService.getLocalStorage();

        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/home');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    )

  }

nextStep() {
    const username = this.registerForm.get('username');
    const email = this.registerForm.get('email');

    if (username?.invalid || email?.invalid) {
      username?.markAsTouched();
      email?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }


  // Registro
  crearUsuario() {
    this.formSumitted = true;
    if (this.registerForm.invalid) return;

    this.authService.crearUsuario(this.registerForm.value).subscribe({
      next: (resp: any) => {
        // 1. IMPORTANTE: Guarda los datos que vienen en la respuesta (ajusta según tu backend)
        // Normalmente el backend devuelve { ok: true, usuario, token }
        if (resp.token && resp.usuario) {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('user', JSON.stringify(resp.usuario));
        }

        // 2. Ahora sí actualizamos el estado del servicio
        this.authService.getLocalStorage();

        // 3. Mostramos el Swal y redirigimos
        Swal.fire({
          title: '¡Gracias por Registrarte!',
          text: 'En breve te enviaremos a tu perfil para completar los datos requeridos',
          icon: 'success',
          timer: 3000, // Le damos 3 segundos para que lea el mensaje
          showConfirmButton: false
        }).then(() => {
          // Redirigimos después de que el Swal se cierre o pase el tiempo
          this.router.navigateByUrl('/profile');
        });
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg || 'No se pudo completar el registro', 'error');
      }
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSumitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSumitted;
  }

  passwordNoValido() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('confirmPassword')?.value;

    if ((pass1 !== pass2) && this.formSumitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    }
  }
  // Registro

  switchRegistrologin() {
    const container = document.querySelector(".logincontainer");
    if (container) {
      container.classList.toggle("sign-up-mode");
    }
    window.scrollTo(0, 0);
  }


}
