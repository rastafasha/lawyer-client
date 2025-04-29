import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { RegisterForm } from '../auth/interfaces/register-form.interface';
import { environment } from '../environments/environment';

const url_servicios = environment.url_servicios;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user:any;
  token:any;

  constructor(
    private router: Router,
    public http: HttpClient
    ) {
      this.getLocalStorage();//devuelve el usuario logueado
    }

    getUser(){
      return this.user;
    }
  
    getLocalStorage(){
      if(localStorage.getItem('token') && localStorage.getItem('user')){
        let USER = localStorage.getItem('user');
        this.user = JSON.parse(USER ? USER: '');
        this.router.navigateByUrl('/app/home');
      }else{
        this.user = null;
        this.router.navigateByUrl('/login');
      }
      // console.log(this.user);
      
   }

   saveLocalStorage(auth:any){
    if(auth && auth.access_token){
      localStorage.setItem("token",auth.access_token.original.access_token);
      localStorage.setItem("user",JSON.stringify(auth.user));
      localStorage.setItem('authenticated', 'true');
      return true;
    }
    return false;
  }

  
  guardarLocalStorage( user:any, access_token: any){
    // localStorage.setItem('token', JSON.stringify(token));
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', access_token.original.access_token);
  }


  login(email:string,password:string){

    // return this.http.post<any>(`${this.serverUrl}/login`, {email: email, password: password}, { withCredentials: false })

    let URL = url_servicios+"/loginguest";
    return this.http.post(URL, {email: email,password: password})
    .pipe(
      map((auth:any) => {
        console.log(auth);
        const result = this.guardarLocalStorage(auth.user, auth.access_token);
        return result;
      }),
      catchError((error:any) => {
        console.log(error);
        return of(undefined);
      })
    )

  }

  crearUsuario(formData: RegisterForm){
    let URL = url_servicios+"/registerguest";
    return this.http.post(URL, formData)
    .pipe(map(user => {
      localStorage.setItem('auth_token', JSON.stringify(user));

      return user;
    }));
  }


 logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authenticated');
  this.router.navigateByUrl('/login');
 }


 closeMenu(){
  var menuLateral = document.getElementsByClassName("sidemenu ");
  for (var i = 0; i<menuLateral.length; i++) {
     menuLateral[i].classList.remove("active");
  }
}

getLocalDarkMode(){
  if(localStorage.getItem('darkmode')){
    var element = document.body;
  element.classList.add("darkmode");
}
}
  

}
