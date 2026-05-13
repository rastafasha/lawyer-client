import { Injectable } from '@angular/core';
import { Banner } from '../models/banner.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs';
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
        map((resp: { ok: boolean, pubs: Banner[] }) => resp.pubs)
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
        map((resp: { ok: boolean, pubs: Banner[] }) => resp.pubs)
      )
  }


  createBanner(data: any) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer' + this.authService.token });
    const URL = baseUrl + '/sideadvices/crear';
    return this.http.post(URL, data, { headers: headers });
  }
  updateBanner(data: any, banner_id: any,) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer' + this.authService.token })
    const URL = baseUrl + '/sideadvices/editar/' + banner_id;
    return this.http.post(URL, data, { headers: headers });
  }
  updateStatus(data: any, banner_id: number) {

    const url = `${baseUrl}/sideadvices/update/status/${banner_id}`;
    return this.http.put(url, data, this.headers);
  }

  deleteBanner(_id: string) {
    const url = `${baseUrl}/sideadvices/destroy/${_id}`;
    return this.http.delete(url, this.headers);
  }


}
