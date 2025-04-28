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
      const url = `${baseUrl}/paymentmethods`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, tiposdepagos: PaymentMethod[]}) => resp.tiposdepagos)
        )
    }
    
  
    getPaymentmethod(_id: number) {
      const url = `${baseUrl}/paymentmethods/show/${_id}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, tipodepago: PaymentMethod}) => resp.tipodepago)
          );
    }
  
    getPaymentMethodByUserId(_id: number) {
      const url = `${baseUrl}/paymentmethods/showbyUser/${_id}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, tiposdepagosuser: PaymentMethod[]}) => resp.tiposdepagosuser)
          );
    }
  
    getPaymentmethodsRecientes() {
      const url = `${baseUrl}/paymentmethods/recientes`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, recientes: PaymentMethod}) => resp.recientes)
        )
    }
    getPaymentmethodsDestacados() {
      const url = `${baseUrl}/paymentmethods/destacados`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, destacados: PaymentMethod}) => resp.destacados)
        )
    }
  
    getByUser(usuario:any) {
      const url = `${baseUrl}/paymentmethods/showbyUser/${usuario}`;
      return this.http.get<any>(url,this.headers)
        .pipe(
          map((resp:{ok: boolean, tipodepago: any}) => resp)
        )
    }
  
    listarUsuario(id:string):Observable<any>{
      const url = `${baseUrl}/paymentmethods/user_paymentmethods/${id}`;
      return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, tipodepago: PaymentMethod}) => resp.tipodepago)
      )
  
    }
  
  
  
    createPaymentmethod(data:any){
      const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
      const URL = baseUrl+'/paymentmethods/store';
      return this.http.post(URL,data, {headers:headers});
    }
    updatePaymentmethod( data:any, id:any,){
      const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token})
      const URL = baseUrl+'/paymentmethods/update/'+id;
      return this.http.post(URL,data,{headers:headers});
    }
    
    updateStatus( data:any, profile_id:number){

      const url = `${baseUrl}/paymentmethods/update/status/${profile_id}`;
      return this.http.put(url,  data, this.headers);
    }
  
    deletePaymentmethod(_id: number) {
      const url = `${baseUrl}/paymentmethods/destroy/${_id}`;
      return this.http.delete(url, this.headers);
    }
  
}
