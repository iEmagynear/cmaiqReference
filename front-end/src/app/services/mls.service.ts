import { Injectable } from '@angular/core';
import { Observable,throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MlsService {

  apiEndpoint:any;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.APIEndpoint
  }

  getMlsList(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'mls/get_mlses', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getMlsListNonLogin(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      //'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'mls/get_mlses_non_login', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  requestMls(info): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'mls/request_mls',info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  // requestMlsList(info): Observable<any> {
  //   var reqHeader = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': localStorage.getItem('token')
  //   });
  //   console.log(reqHeader);
  //   return this.http.post<any>(this.apiEndpoint + 'mls/request_mls',info, { headers: reqHeader }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

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
