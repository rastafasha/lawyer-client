import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
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

  getSolicitud(id: string) {
    const url = `${baseUrl}/solicitudes/${id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, solicitud: Solicitud}) => resp.solicitud)
        );
  }

  getByUser(usuario:any) {
    const url = `${baseUrl}/solicitudes/cliente/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, solicitudes: Solicitud}) => resp.solicitudes)
      )
  }
  

  getByContactosCliente(usuario:any) {
    const url = `${baseUrl}/solicitudes/contactos-cliente/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, clientes: any}) => resp)
      )
  }

  

  createSolicitud(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = baseUrl+'/solicitudes/crear';
    return this.http.post(URL,data, this.headers);
  }
 
  updateSolicitudStatus( data:any, solicitud_id:number){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token})
    const URL = baseUrl+'/solicitudes/editar/'+solicitud_id;
    return this.http.put(URL, data,this.headers);
  }


  deleteSolicitud(_id: string) {
    const url = `${baseUrl}/solicitudes/borrar/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
