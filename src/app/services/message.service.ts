import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';
const baseUrl = environment.url_servicios;
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public message!: Message;
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


  getMessages() {
    const url = `${baseUrl}/messages`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, messages: Message}) => resp.messages)
      )
  }

  getMessage(id: Message) {
    const url = `${baseUrl}/message/show/${id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, message: Message}) => resp.message)
        );
  }

  getByUser(usuario:any, client:any) {
    const url = `${baseUrl}/message/user/${usuario}/${client}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, messages: Message}) => resp.messages)
      )
  }
  getByClient(client:any, usuario:any) {
    const url = `${baseUrl}/message/cliente/${client}/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, messages: Message}) => resp.messages)
      )
  }
  
  

  createMessage(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = baseUrl+'/message/store';
    return this.http.post(URL,data, {headers:headers});
  }
}
