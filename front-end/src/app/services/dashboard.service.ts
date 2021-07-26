import { Injectable } from '@angular/core';
import { Observable,throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiEndpoint: any;
  constructor(private http: HttpClient,private router:Router) {

    this.apiEndpoint = environment.APIEndpoint;
  }

  get_default_values(): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'admin/get_default_values', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  update_default_values(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/update_default_values', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  add_mls_user(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/add_mls_member', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_mls_users(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/mls_member', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  delete_mls_users(info:any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/delete_mls_member',info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );

  }

  delete_news(info:any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/delete_news',info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );

  }

  /* bulk_upload_members(){

  } */

  bulk_upload_members(body: any) {

    const formData = new FormData();
    //console.log(body.file);
    formData.append('file', body.file);
    formData.append('mls_id', body.mls_id);
    formData.append('wantsto', body.wantsto);
    formData.append('wantstonotify', body.wantstonotify);
    //'mls_id': localStorage.getItem('mls'),
    //console.log(formData);

    var reqHeader = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/bulk_upload_members',formData, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  bulk_remove_members(body: any) {

    const formData = new FormData();
    //console.log(body.file);
    formData.append('file', body.file);
    formData.append('mls_id', body.mls_id);
    //console.log(formData);

    var reqHeader = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/bulk_remove_members',formData, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_mls_user(id): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'admin/get_mls_member/'+id, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  edit_mls_user(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/edit_mls_member', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  edit_mls_user_details(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'admin/edit_mls_user_details', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
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

  get_mls_ids_member(){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'admin/get_mls_ids_member', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_mls_ids_mlsadmin(){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'admin/get_mls_ids_mlsadmin', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_admin_mls_users(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'admin/mls_member_superadmin', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_mlslist_superadmin(): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.get<any>(this.apiEndpoint + 'admin/get_mlslist_superadmin', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  edit_mls_member_superadmin (id): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'admin/edit_mls_member_superadmin', id, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_mlsgroup_superadmin(data){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'admin/get_mlsgroup_superadmin',data, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  edit_mls_superadmin(data): Observable<any> {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'admin/edit_mls_superadmin',data, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  add_mls_superAdmin_user(info: any): Observable<any> {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'admin/add_mls_superAdmin_user', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }
  
  get_news(): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(this.apiEndpoint + 'admin/get_news', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_news_by_id(id): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.get<any>(this.apiEndpoint + 'admin/get_news_by_id/'+id, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  edit_news(info: any): Observable<any> {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'admin/edit_news', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  add_news(info: any): Observable<any> {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'admin/add_news', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {

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
