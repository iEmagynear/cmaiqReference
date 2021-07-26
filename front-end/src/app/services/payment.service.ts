import { Injectable } from '@angular/core';
import { Observable,throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  apiEndpoint:any;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.APIEndpoint
  }

  charge(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'stripe/charge', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  retrievePlan(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'stripe/retrieve_plan/'+info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  create_customer(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'stripe/create_customer',info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  cancel_subscription(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'stripe/un_subscribe/'+info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  update_payment_details(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'stripe/update_payment_details',info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_sub_payment(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'stripe/get_sub_payment/'+info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  cancel_subscription_offlne(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'stripe/un_subscribe_offline/'+info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {

    console.log(error)

    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);

    return throwError(error);
  }
}
