import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiEndpoint:any;

  constructor(private http: HttpClient) {this.apiEndpoint = environment.APIEndpoint }

  get_subdivisions(info): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'mls/get_subdivisions',info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_zips(info): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'mls/get_zipcodes',info, { headers: reqHeader }).pipe(
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

    //console.log(errorMessage);
    return throwError(error);
  }

}
