import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public client!: Client;
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


  getClientes() {
    const url = `${baseUrl}/clients`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, clients: Client}) => resp.clients)
      )
  }

  getClient(id:Client) {
    const url = `${baseUrl}/client/show/${id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, user:Client}) => resp.user)
        );
  }

  getClientsByUser(user:any) {
    const url = `${baseUrl}/client/clientes-user/${user}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, clients:Client}) => resp.clients)
      )
  }
 
  getByContactosCliente(user:any) {
    const url = `${baseUrl}/client/contactos-cliente/${user}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, clientes: any}) => resp)
      )
  }

  

  addClienttoUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = baseUrl+'/client/addClienttoUser';
    return this.http.post(URL,data, {headers:headers});
  }
 

  removeClient(_id: number) {
    const url = `${baseUrl}/client/removeClientFromUser/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
