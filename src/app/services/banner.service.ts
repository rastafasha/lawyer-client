import { Injectable } from '@angular/core';
import { Banner } from '../models/banner.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  public banner!: Banner;
  
  constructor(private http: HttpClient,
    public authService: AuthService
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


  getBanners(page: number = 1, perPage: number = 10) {
    const url = `${baseUrl}/sideadvices?page=${page}&per_page=${perPage}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, sideadvices: Banner[] }) => resp.sideadvices)
      )
  }


  getBanner(_id: number) {
    const url = `${baseUrl}/sideadvices/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, pub: Banner }) => resp.pub)
      );
  }

  getBannerActivos() {
    const url = `${baseUrl}/sideadvices/activos`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, sideadvices: Banner[] }) => resp.sideadvices)
      )
  }



}
