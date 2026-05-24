import { Injectable } from '@angular/core';
import { Payment } from '../models/payment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
const baseUrl = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public payment!: Payment;
  private filteredProjectsSubject = new BehaviorSubject<Payment[]>([]);
  public filteredProjects$: Observable<Payment[]> = this.filteredProjectsSubject.asObservable();


  constructor(private http: HttpClient) { }

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
   emitFilteredProjects(projects: Payment[]) {
    this.filteredProjectsSubject.next(projects);
  }

  getPayments() {
    const url = `${baseUrl}/pagos`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, payments: Payment }) => resp.payments)
      )
  }
  getMontlyReport( month?: number, year?: number) {
    let url = `${baseUrl}/pagos/monthlyreport`;
    if (month !== undefined) {
      url += `?month=${month.toString().padStart(2, '0')}`;
    }
    if (year !== undefined) {
      const connector = url.includes('?') ? '&' : '?';
      url += `${connector}year=${year}`;
    }
    return this.http.get(url, this.headers);
  }

  getPayment(_id: string) {
    const url = `${baseUrl}/pagos/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, payment: Payment }) => resp.payment)
      );
  }

 getByUser(usuario: any, page: number = 1, limit: number = 6,) {
  // Construimos la URL con parámetros de paginación
  const url = `${baseUrl}/pagos/cliente/${usuario}?page=${page}&limit=${limit}`;
  
  return this.http.get<any>(url, this.headers)
    .pipe(
      // Importante: Si la API devuelve un array, asegúrate que el tipado sea Payment[]
      map((resp: { ok: boolean, pagos: any[] }) => resp.pagos)
    );

    
}

  getByStatus(status: string) {
    const url = `${baseUrl}/pagos/status/${status}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, payments: Payment[] }) => resp.payments)
      )
  }


  createPayment(data: any): Observable<any> {
  // Asegúrate de NO pasar 'this.headers' si estos contienen 'Content-Type': 'application/json'
  // Solo pasa el Token si es necesario
  const headers = new HttpHeaders({
    'x-token': localStorage.getItem('token') || '' 
    // ¡OJO! No pongas Content-Type aquí
  });

  return this.http.post(`${baseUrl}/pagos/crear`, data, { headers });
}


  
  validarPagoAdmin(payment: any) {
    const url = `${baseUrl}/pagos/validarpago/${payment._id}`;
    return this.http.post(url, payment, this.headers);
  }

  updatePaymentStatus(payment: Payment,) {
    const url = `${baseUrl}/pagos/updatestatus/${payment._id}`;
    return this.http.put(url, payment, this.headers);
  }

  updatePayment(id: string, data: any) {
    const url = `${baseUrl}/pagos/update/${id}`;
    return this.http.put(url, data, this.headers);
}

  deletePayment(_id: any) {
    const url = `${baseUrl}/pagos/delete/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
