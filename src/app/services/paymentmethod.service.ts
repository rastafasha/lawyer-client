import { Injectable } from '@angular/core';
import { PaymentMethod } from '../models/paymentmethod.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class PaymentmethodService {

  public tipodepago!: PaymentMethod;
  
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
  
  
    getPaymentmethods() {
      const url = `${baseUrl}/tipospago`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, paymentMethods: PaymentMethod[]}) => resp.paymentMethods)
        )
    }
    
  
    getPaymentmethod(_id: number) {
      const url = `${baseUrl}/tipospago/${_id}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, tipodepago: PaymentMethod}) => resp.tipodepago)
          );
    }
  
   
  
    getPaymentmethodsRecientes() {
      const url = `${baseUrl}/tipospago/recientes`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, recientes: PaymentMethod}) => resp.recientes)
        )
    }
    getPaymentmethodsDestacados() {
      const url = `${baseUrl}/tipospago/destacados`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, destacados: PaymentMethod}) => resp.destacados)
        )
    }
  
    getByUser(usuario:any) {
      const url = `${baseUrl}/tipospago/user/${usuario}`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, paymentMethods: PaymentMethod}) => resp.paymentMethods)
        )
    }
  
  
  
    createPaymentmethod(data:any){
      const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
      const URL = baseUrl+'/tipospago/store';
      return this.http.post(URL,data, {headers:headers});
    }
    updatePaymentmethod( data:any, id:any,){
      const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token})
      const URL = baseUrl+'/tipospago/update/'+id;
      return this.http.post(URL,data,{headers:headers});
    }
    
    updateStatus( data:any, profile_id:number){

      const url = `${baseUrl}/tipospago/update/status/${profile_id}`;
      return this.http.put(url,  data, this.headers);
    }
  
    deletePaymentmethod(_id: number) {
      const url = `${baseUrl}/tipospago/destroy/${_id}`;
      return this.http.delete(url, this.headers);
    }
  
}
