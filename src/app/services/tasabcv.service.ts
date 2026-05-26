import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Tasabcv } from '../models/tasabcba';
import { environment } from '../../environments/environment';

const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class TasabcvService {

  public tasabcv!: Tasabcv;
  
  
    constructor(private http: HttpClient) { }
  
  get token():string{
    return localStorage.getItem('token') || '';
  }
  
  
    get headers(){
      return{
        headers: {
          'auth_token': this.token
        }
      }
    }
  
  
    getTasas() {
      const url = `${baseUrl}/tasabcv`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, tasas: Tasabcv}) => resp.tasas)
        )
    }
    getUltimaTasa() {
      const url = `${baseUrl}/tasabcv/ultimatasa`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, tasa: Tasabcv}) => resp.tasa)
        )
    }
  
  
}
