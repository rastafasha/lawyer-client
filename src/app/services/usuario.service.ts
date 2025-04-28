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

  

  listUsers(page: number = 1, perPage: number = 10){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = `${url_servicios}/users?page=${page}&per_page=${perPage}`;
    return this.http.get(URL, {headers:headers});
  }

  getCharacters(apiUrl:string = `${url_servicios}/users`):Observable<any> {
      return this.http.get(apiUrl).pipe(share())
  
    }

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token})
    const URL = url_servicios+'/users/config';
    return this.http.get(URL, {headers:headers});
  }
  storeUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/users/store";
    return this.http.post(URL,data, {headers:headers});
  }
  showUser(user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/user/show/"+user_id;
    return this.http.get(URL,{headers:headers});
  }
  editUser(data:any, user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/users/update/"+user_id;
    return this.http.post(URL,data,{headers:headers});
  }
  
  showUserProfile(user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/users/profile/"+user_id;
    return this.http.get(URL,{headers:headers});
  }
  editUserProfile(data:any, user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/staffs/update/"+user_id;
    return this.http.post(URL,data,{headers:headers});
  }


  yo(user:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    // let headers = this.headers;
    const URL = url_servicios+'/me';
    return this.http.post(URL,user, {headers: headers})
  }
  
  
  deleteUser(user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/users/destroy/"+user_id;
    return this.http.delete(URL, {headers:headers});
  }

  

  updateStatus(data:any, user_id:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = url_servicios+"/users/update/status/"+user_id;
    return this.http.put(URL,data,{headers:headers});
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
