import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
const base_url = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class ComentarioappService {

  constructor(
    private http: HttpClient
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

  create(data: any) {
    const url = `${base_url}/comentarios/store`;
    return this.http.post(url, data, this.headers);
  }

  getByMember(usuario: any, page: number = 1, limit: number = 6,) {
    // Construimos la URL con parámetros de paginación
    const url = `${base_url}/comentarios/user/${usuario}?page=${page}&limit=${limit}`;

    return this.http.get<any>(url, this.headers)
      .pipe(
        // Importante: Si la API devuelve un array, asegúrate que el tipado sea Payment[]
        map((resp: { ok: boolean, comentarios: any[] }) => resp.comentarios)
      );
  }
}
