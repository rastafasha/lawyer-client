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
  styleUrls: [ './login.component.css' ]
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
  
  // Registro

  errors:any = null;
  registerForm!: FormGroup;
  langs: string[] = [];
  public activeLang = 'es';

  

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
    translate.get(this.langs).subscribe(res =>{
      console.log(res);
    })
    // console.log(this.translate);
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: [ '', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      terminos: [false, Validators.required],
  
    }, {
      validators: this.passwordsIguales('password', 'password2')
  
    }); 
  }
  
ngOnInit(){
  
  const lang = localStorage.getItem('lang');
    if (lang) {
      this.activeLang = lang;
      this.translate.use(lang);
      }
  
  this.loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required],
    remember: [false]

  });
  this.authService.getLocalStorage();
  
}



login(){ 
  if(!this.loginForm){
    Swal.fire('Error', 'Favor ingresar datos', 'error');
    return;
  }

  this.authService.login(
    this.loginForm.value.email ? this.loginForm.value.email : '' ,
    this.loginForm.value.password ? this.loginForm.value.password: ''

  ).subscribe(
    (resp:any) =>{
      if(this.loginForm.get('remember')?.value){
        localStorage.setItem('email', this.loginForm.get('email')?.value);
        // document.location.reload();
        
      }else{
        localStorage.removeItem('email');
      }
      this.authService.getLocalStorage();
      if(localStorage.getItem('user')){
        setTimeout(()=>{
          this.router.navigateByUrl('/app');
        },500)

      }
      
    },(error) => {
      Swal.fire('Error', error.error.msg, 'error');
      this.errors = error.error.msg;
      document.location.reload();
    }
    )
    // console.log(this.user)
}




// Registro
crearUsuario(){
  this.formSumitted = true;
  // if(this.registerForm.invalid){
  //   return;
  // }

  this.authService.crearUsuario(this.registerForm.value).subscribe(
    resp =>{
      Swal.fire('Registrado!', `Ya puedes ingresar`, 'success');
      this.ngOnInit();
    },(error) => {
      Swal.fire('Error', error.error.msg, 'error');
      this.errors = error.error;
    }
  );
  return false;
}

campoNoValido(campo: string): boolean {
  if(this.registerForm.get(campo)?.invalid && this.formSumitted){
    return true;
  }else{
    return false;
  }
}

aceptaTerminos(){
  return !this.registerForm.get('terminos')?.value && this.formSumitted;
}

passwordNoValido(){
  const pass1 = this.registerForm.get('password')?.value;
  const pass2 = this.registerForm.get('password2')?.value;

  if((pass1 !== pass2) && this.formSumitted){
    return true;
  }else{
    return false;
  }
}

passwordsIguales(pass1Name: string, pass2Name: string){
  return (formGroup: FormGroup) =>{
    const pass1Control = formGroup.get(pass1Name);
    const pass2Control = formGroup.get(pass2Name);

    if(pass1Control?.value === pass2Control?.value){
      pass2Control?.setErrors(null)
    }else{
      pass2Control?.setErrors({noEsIgual: true});
    }
  }
}
// Registro

switchRegistrologin(){
  const container = document.querySelector(".logincontainer");
  if (container) {
    container.classList.toggle("sign-up-mode");
  }
  window.scrollTo(0, 0);
}


}
