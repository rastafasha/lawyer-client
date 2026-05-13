import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { RegisterForm } from '../auth/interfaces/register-form.interface';
import { environment } from '../environments/environment';
import { Usuario } from '../models/usuario.model';

const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public usuario: Usuario | null = null;
  public estaAutenticado = false;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public auth2: any;

  constructor(
    private router: Router,
    public http: HttpClient
  ) {
    this.getLocalStorage();//devuelve el usuario logueado
  }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get role(): 'SUPERADMIN' | 'ADMIN' | 'USER'|'MEMBER' {
    return this.usuario?.role || 'USER';
  }

  get uid():string{
    return this.usuario?.uid || '';
  }

  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage(token: string, userData: any){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    this.getLocalStorage();  // Populate service state and emit
  }

  getLocalStorage(): Usuario | null {
    const authStr = localStorage.getItem('estaAutenticado');
    this.estaAutenticado = authStr === 'true';


    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Create User instance from parsed data (match JSON shape)
        this.usuario = new Usuario(
          userData.username || '',
          userData.email || '',
          userData.terminos || false,
          undefined,  // password not stored
          userData.google || false,
          userData.role,
          userData.uid,
          userData.createdAt ? new Date(userData.createdAt) : undefined,
          userData.updatedAt ? new Date(userData.updatedAt) : undefined
        );
        this.currentUserSubject.next(this.usuario);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        this.usuario = null;
        this.currentUserSubject.next(null);
      }
    } else {
      this.usuario = null;
      this.currentUserSubject.next(null);
    }

    return this.usuario;
  }

  getEstaAutenticado(): boolean {
    return this.estaAutenticado;
  }

  login(formData: any) {
    return this.http.post(`${baseUrl}/auth/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('estaAutenticado', 'true');
          this.guardarLocalStorage(resp.token, resp.user);
        })
      )
  }

  logout(){
    this.currentUserSubject.next(null);
    this.refresh();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('estaAutenticado');
    localStorage.removeItem('cart');
    this.usuario = null;
    this.estaAutenticado = false;
    this.router.navigateByUrl('./login');
  }

  refresh(): void {
    window.location.reload();
    this.router.navigateByUrl('/home');
  }

  crearUsuario(formData: RegisterForm) {
    let URL = baseUrl + "/register";
    return this.http.post(URL, formData)
      .pipe(map(user => {
        localStorage.setItem('auth_token', JSON.stringify(user));

        return user;
      }));
  }

  closeMenu() {
    var menuLateral = document.getElementsByClassName("sidemenu ");
    for (var i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.remove("active");
    }
  }

  getLocalDarkMode() {
    if (localStorage.getItem('darkmode')) {
      var element = document.body;
      element.classList.add("darkmode");
    }
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${baseUrl}/auth/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { username, email, google, role, uid } = resp.usuario;

        this.usuario = new Usuario(username, email, !!google, undefined, !!google, role, uid);
        this.guardarLocalStorage(resp.token, resp.user);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  


}
