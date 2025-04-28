import { Injectable } from '@angular/core';
import { Speciality } from '../models/speciality.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class SpecialitiesService {

  
  public speciality!: Speciality;
  constructor(private http: HttpClient) { }

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


  getSpecialitys() {
    const url = `${baseUrl}/specialities`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, specialities: Speciality[]}) => resp.specialities)
      )
  }

  getAllClientReportByPatient(
        
        // created_at = '',
        // page = 1,
        pais = '',
        rating?: number,
        speciality_id?: number
      ) {
        let LINK = '';
    
        // if (pais) LINK += `&pais=${pais}`;
        if (pais) {
          LINK += '&pais=' + pais;
        }
        if (speciality_id) LINK += `&speciality_id=${speciality_id}`;
        if (rating) LINK += `&rating=${rating}`;
        
  
        const URL =
          baseUrl +
          '/speciality/showByUserFiltered/' +
          
          LINK;
        // return this.http.get<any>(URL);
  
        return this.http.get<any>(URL, this.headers)
          .pipe(
            map((resp:{ok: boolean, documents: Document}) => resp.documents)
            );
      }

  getSpecialitysMayorCero() {
    const url = `${baseUrl}/specialities/filtradoMayorCero`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, specialities: Speciality[]}) => resp.specialities)
      )
  }

  getSpeciality(id: Speciality) {
    const url = `${baseUrl}/speciality/show/${id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, speciality: Speciality}) => resp.speciality)
        );
  }
  getSpecialitywithUsers(id: number) {
    const url = `${baseUrl}/speciality/showWithUsers/${id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, speciality: any}) => resp)
        );
  }

  getByUser(usuario:any) {
    const url = `${baseUrl}/speciality/showbyUser/${usuario}`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, speciality: any}) => resp)
      )
  }

  listarUsuario(id:string):Observable<any>{
    const url = `${baseUrl}/speciality/user_speciality/${id}`;
    return this.http.get<any>(url,this.headers)
    .pipe(
      map((resp:{ok: boolean, speciality: Speciality}) => resp.speciality)
    )

  }


  createspeciality(speciality:Speciality) {
    const url = `${baseUrl}/speciality/store`;
    return this.http.post(url, speciality, this.headers);
  }

  updatespeciality(speciality:Speciality) {
    const url = `${baseUrl}/speciality/update/${speciality.id}`;
    return this.http.put(url, speciality, this.headers);
  }

  deletespeciality(_id: string) {
    const url = `${baseUrl}/specialitys/destroy/${_id}`;
    return this.http.delete(url, this.headers);
  }

}
