import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, share } from 'rxjs';
import { environment } from '../environments/environment';
import { Favorite } from '../models/favorite.model';
import { AuthService } from './auth.service';

const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  public favorite!: Favorite;
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


  getFavorites() {
    const url = `${baseUrl}/favorites`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, favorites: Favorite}) => resp.favorites)
      )
  }

  getCharacters(apiUrl:string = `${baseUrl}/favorites`):Observable<any> {
      return this.http.get(apiUrl).pipe(share())
  
    }
  

  getFavorite(_id: number) {
    const url = `${baseUrl}/favorites/show/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, favorite: Favorite}) => resp.favorite)
        );
  }


  getByUser(usuario:any) {
    const url = `${baseUrl}/favorites/showbyUser/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, favorites: any}) => resp)
      )
  }
  getByCliente(cliente:any) {
    const url = `${baseUrl}/favorites/showbyCliente/${cliente}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, favorites: any}) => resp)
      )
  }



  createFavorite(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token});
    const URL = baseUrl+'/favorites/store';
    return this.http.post(URL,data, {headers:headers});
  }
  updateFavorite( data:any, favorite_id:any,){
    const headers = new HttpHeaders({'Authorization': 'Bearer'+this.authService.token})
    const URL = baseUrl+'/favorites/update/'+favorite_id;
    return this.http.post(URL,data,{headers:headers});
  }

  deleteFavorite(_id: string) {
    const url = `${baseUrl}/favorites/destroy/${_id}`;
    return this.http.delete(url, this.headers);
  }

}
