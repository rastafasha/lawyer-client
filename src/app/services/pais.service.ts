import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,  HttpHeaders } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import  {catchError, map, tap} from 'rxjs/operators';
import { Params, Router } from '@angular/router';
import { Pais } from '../models/pais';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaisService {

  public serverUrl: string;
  public storageUrl!: string;
  public pais!: string;
  public identity: any;
  public token: any;

  public cargando = false;

  errorData: {} | undefined;


  constructor(
    private http: HttpClient,
    public router: Router
    ) {
    this.serverUrl = environment.url_servicios;

  }

  getCarteleraPaises(): Observable<Pais>{

    this.cargando = true;
    return this.http.get<Pais>(`${this.serverUrl}/paises/countryList/`,)
    .pipe(
      map( resp => {
        return resp;
      }),
    );


    }

  getPaises(): Observable<any>  {
    return this.http.get<Pais>(this.serverUrl + '/paises')
    .pipe(
      map( resp => {
        return resp;
      }),
      catchError(this.handleError)
    )
  }

  getPais(id:number){

    return this.http.get<Pais>(`${this.serverUrl}/pais/show/${id}`).pipe(
      catchError(this.handleError)
    )

  }
  getPaisDetail(code:string){

    return this.http.get<Pais>(`${this.serverUrl}/pais/code/${code}`).pipe(
      catchError(this.handleError)
    )

  }

  getPaisCode(code:string): Observable<Pais> {

    return this.http.get<Pais>(this.serverUrl + '/pais/code/' + code).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }
}
