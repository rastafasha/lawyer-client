import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { of } from 'rxjs';

import { Payment } from '../models/payment'; // Asegúrate de tener estos modelos creados
import { Transferencia } from '../models/transferencia';
import { environment } from '../environments/environment';
import { Usuario } from '../models/usuario.model';



const base_url = environment.url_servicios;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  private trasnformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      (user) =>
        new Usuario(
          user.username,
          user.email,
          false, // terminos
          user.numdoc || '',
          undefined, // password
          user.google || false,
          user.role,
          user.uid,
          user.createdAt ? new Date(user.createdAt) : undefined,
          user.updatedAt ? new Date(user.updatedAt) : undefined
        )
    );
  }

  

  private trasnformarPayments(resultados: any[]): Payment[] {
  // Aquí podrías agregar lógica de fechas si tu modelo Facturacion la requiere
  return resultados; 
}

  

 buscar(
    tipo: 'usuarios' | 'payments' , 
    termino: string = ''
  ) {
    // Si el término está vacío, podrías retornar un array vacío o manejarlo según tu UX
   if (!termino || termino.trim().length === 0) { 
        return of([]); 
    }

    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    
    return this.http.get<any>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.trasnformarUsuarios(resp.resultados);
          case 'payments':
            return this.trasnformarPayments(resp.resultados);
          default:
            return [];
        }
      })
    );
  }

  searchGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get<any[]>(url, this.headers);
  }

 
    
}
