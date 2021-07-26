import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiEndpoint: any;

  /* private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  } */

  constructor(private http: HttpClient) {

    this.apiEndpoint = environment.APIEndpoint
  }

  signup(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'users/signup', info).pipe(
      catchError(this.handleError)
    );
  }

  login(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'auth/login', info).pipe(
      catchError(this.handleError)
    );
  }

  sociallogin(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'auth/sociallogin', info).pipe(
      catchError(this.handleError)
    );
  }

  userCapture(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'passport/userCapture', info).pipe(
      catchError(this.handleError)
    );
  }

  agree(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'auth/agree', info).pipe(
      catchError(this.handleError)
    );
  }

  eulaAgree(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'auth/eulaAgree', info).pipe(
      catchError(this.handleError)
    );
  }

  toaAgree(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'auth/toaAgree', info).pipe(
      catchError(this.handleError)
    );
  }

  forgotPasswordApi(info: any): Observable<any> {
    //console.log(info);
    return this.http.post<any>(this.apiEndpoint + 'auth/forgot-password', info).pipe(
      catchError(this.handleError)
    );
  }

  resetPasswordApi(info: any): Observable<any> {
    //console.log(info);
    return this.http.post<any>(this.apiEndpoint + 'auth/reset-password', info).pipe(
      catchError(this.handleError)
    );
  }

  contactUs(info: any): Observable<any> {

    return this.http.post<any>(this.apiEndpoint + 'users/contact-us', info).pipe(
      catchError(this.handleError)
    );
  }

  ticker(): Observable<any> {
    return this.http.get<any>(this.apiEndpoint + 'users/ticker').pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {
    //console.log(error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //console.log(error);
    /* if (error.status === 401) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    } */
    return throwError(error);
  }
  get_mls_ids(){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'admin/get_mls_ids', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }
}
