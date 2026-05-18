import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inyección funcional de Angular
  const token = localStorage.getItem('token');
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        'x-token': token,
        'Accept': 'application/json'
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const serverMessage = error.error?.msg;

      if (error.status === 401 || serverMessage === 'Token no valido') {
        localStorage.clear();
        
        Swal.fire({
          title: 'Sesión expirada',
          text: 'Por favor inicia sesión nuevamente.',
          icon: 'warning',
          confirmButtonText: 'Ir al Login'
        }).then(() => {
          router.navigate(['/login']);
        });
      }

      return throwError(() => error);
    })
  );
};

