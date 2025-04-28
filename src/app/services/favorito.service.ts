import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Observer, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  private base_url: string = 'https://rickandmortyapi.com/api/';
  private httpClient = inject(HttpClient);

  getCharacters(apiUrl:string = `${this.base_url}/character`):Observable<any> {
    return this.httpClient.get(apiUrl).pipe(share())

  }

  
}
