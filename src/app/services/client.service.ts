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
    public authService: AuthService
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  getClientes() {
    const url = `${baseUrl}/clients`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, clients: Client }) => resp.clients)
      )
  }

  getClient(id: any) {
    const url = `${baseUrl}/clients/${id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, user: Client }) => resp.user)
      );
  }

  getMyClients(user: any) {
    const url = `${baseUrl}/clients/myclients/${user}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, clients: Client }) => resp.clients)
      )
  }


  addClienttoUser(data: any) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer' + this.authService.token });
    const URL = baseUrl + '/clients/addclient';
    return this.http.post(URL, data, { headers: headers });
  }


  removeClient(client_id: string) {
    // Solo pasamos el client_id, el user_id lo sabrá el backend por el token
    const url = `${baseUrl}/clients/removeclient/${client_id}`;
    return this.http.delete(url, this.headers);
  }
}
