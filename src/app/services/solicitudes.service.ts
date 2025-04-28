import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  public profile!: Solicitud;
  constructor(private http: HttpClient,
    public authService:AuthService
  ) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }


  getSolicitudes() {
    const url = `${baseUrl}/solicitudes`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, solicutudes: Solicitud}) => resp.solicutudes)
      )
  }

  getSolicitud(id: Solicitud) {
    const url = `${baseUrl}/solicitud/show/${id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, solicitud: Solicitud}) => resp.solicitud)
        );
  }

  getByUser(usuario:any) {
    const url = `${baseUrl}/solicitud/showbyUser/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, solicitudes: Solicitud}) => resp.solicitudes)
      )
  }
  getByGuest(usuario:any) {
    const url = `${baseUrl}/solicitud/cliente/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, solicitudes: Solicitud}) => resp.solicitudes)
      )
  }
  getByMember(usuario:any) {
    const url = `${baseUrl}/solicitud/user/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, solicitudes: Solicitud}) => resp.solicitudes)
      )
  }
  getByClientesUser(usuario:any) {
    const url = `${baseUrl}/solicitud/clientes-user/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, clientes: Solicitud}) => resp.clientes)
      )
  }
  getByContactosCliente(usuario:any) {
    const url = `${baseUrl}/solicitud/contactos-cliente/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, clientes: any}) => resp)
      )
  }

  

  createSolicitud(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = baseUrl+'/solicitud/store';
    return this.http.post(URL,data, {headers:headers});
  }
 
  updateSolicitudStatus( data:any, solicitud_id:number){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token})
    const URL = baseUrl+'/solicitud/update-status/'+solicitud_id;
    return this.http.put(URL, data,{headers:headers});
  }


  deleteSolicitud(_id: string) {
    const url = `${baseUrl}/solicitud/destroy/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
