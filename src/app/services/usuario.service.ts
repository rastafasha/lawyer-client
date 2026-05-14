import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
import { Observable, Observer, share } from 'rxjs';

const url_servicios = environment.url_servicios;
declare let $:any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:any = JSON.parse(localStorage.getItem('user') || '{}');
  constructor(
    public http: HttpClient,
    public authService: AuthService,

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


  listUsers(){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = `${url_servicios}/usuarios/`;
    return this.http.get(URL, this.headers);
  }
  listUsersMember(){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = `${url_servicios}/usuarios/member`;
    return this.http.get(URL, this.headers);
  }
  listUsersPaginados(page: number = 1, perPage: number = 10){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = `${url_servicios}/usuarios/paginados?page=${page}&per_page=${perPage}`;
    return this.http.get(URL, this.headers);
  }

  

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token})
    const URL = url_servicios+'/usuarios/config';
    return this.http.get(URL, this.headers);
  }
  storeUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/usuarios/store";
    return this.http.post(URL,data, this.headers);
  }
  showUser(user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/usuarios/"+user_id;
    return this.http.get(URL,this.headers);
  }
  editUser(data:any, user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/usuarios/update/"+user_id;
    return this.http.post(URL,data,this.headers);
  }
  
 
  editUserProfile(data:any, user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/usuarios/update/"+user_id;
    return this.http.post(URL,data,this.headers);
  }


  yo(user:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    // let headers = this.headers;
    const URL = url_servicios+'/me';
    return this.http.post(URL,user, {headers: headers})
  }
  
  
  deleteUser(user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/usuarios/destroy/"+user_id;
    return this.http.delete(URL, this.headers);
  }

  

  updateStatus(data:any, user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/usuarios/update/status/"+user_id;
    return this.http.put(URL,data,this.headers);
  }

  isPermission(permission:string){
    if(this.user.roles.includes('SUPERADMIN')){
      return true;
    }
    if(this.user.permissions.includes(permission)){
      return true;
    }
    return false;
  }
}
