import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
 } from '@angular/common/http';
 import { Observable, throwError } from 'rxjs';
 import { retry, catchError } from 'rxjs/operators';

 export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        //retry(1),
        catchError((err: HttpErrorResponse) => {

          if (err.status === 401) {
            // auto logout if 401 response returned from api
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            location.reload(true);
          }

          const error = err.error;
          return throwError(error);
        })
      )
  }
 }
