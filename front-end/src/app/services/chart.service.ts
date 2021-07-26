import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  apiEndpoint: any;
  initLoadNum = 100;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.APIEndpoint
  }

  addClient(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_client', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_exchange_price(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'auth/get-exchange-price', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );

  }

  properties_import(body: any): Observable<any> {

    const formData = new FormData();
    formData.append('file', body.file);
    formData.append('mls_id', body.mls_id);

    var reqHeader = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/properties_import', formData, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );

  }

  properties_import_zip(body: any): Observable<any> {

    const formData = new FormData();
    formData.append('file', body.file);
    formData.append('mls_id', body.mls_id);

    var reqHeader = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/properties_import_zip', formData, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );

  }

  omp_properties_import(body: any): Observable<any> {

    const formData = new FormData();
    formData.append('file', body.file);
    formData.append('mls_id', body.mls_id);

    var reqHeader = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/omp_properties_import', formData, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );

  }

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

    return this.http.post<any>(this.apiEndpoint + 'admin/bulk_upload_members', formData, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  editClient(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/edit_client', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getStateList(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'chart/get_states', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getClientList(mls: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'chart/get_clients' + '/' + mls, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getClientListNew(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/get_clients_new', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  delete_client(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/delete_client', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  delete_property(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/delete_property', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_client(id): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'chart/get_client/' + id, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_property(id): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'chart/get_property/' + id, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }


  generate_token(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    //console.log(reqHeader);

    return this.http.post<any>(this.apiEndpoint + 'chart/generate_token', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_api_type(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    //console.log(reqHeader);

    return this.http.post<any>(this.apiEndpoint + 'chart/get_api_type', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getPropertyList(info): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'chart/get_properties' + '/' + info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getPropertyListClient(info): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'chart/get_properties_client' + '/' + info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getTempData(info): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'chart/getTempData' + '/' + info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_user_info(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'admin/user_details', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_user_subscriptions(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'stripe/get_subscriptions', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_user_subscriptions_admin(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'stripe/get_subscriptions_admin', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_user_all_subscriptions(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.get<any>(this.apiEndpoint + 'stripe/get_user_all_subscriptions', { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_chart_details(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/get_chart_details', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_chart_details_only(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/get_chart_details_only', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_chart_details_investment(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/get_chart_details_investment', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_chart_details_investment_with_header(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/get_chart_details_investment', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getPropertyListNew(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    //console.log(reqHeader);
    return this.http.post<any>(this.apiEndpoint + 'chart/get_properties_new', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }


  get_mls_details(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/get_mls_details', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Api for add new unknown status
   */
  saveUnknownStatus(info: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/save_unknownstatus', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  addProperty(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_property', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  editProperty(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/edit_property', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  addChart(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_chart', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  findMlsImage(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/find_mls_image', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  getsubdivisions(sub: any, filter?: string): Observable<any> {

    if (filter) {
      //var f = /filter/g;
      var strRegExPattern = filter;
      var filteredData: any = [];
      sub.forEach(function (item, index) {
        //console.log(new RegExp(strRegExPattern, 'gi'));
        var res = item.match(new RegExp(strRegExPattern, 'gi'));
        if (res) {
          //console.log(item);
          filteredData.push(
            //"id":item.id,
            item
          );
        }

      });

      return of(filteredData.slice(0, this.initLoadNum));

    }
    else {

      return of(sub.slice(0, this.initLoadNum));
    }

  }

  getzips(sub: any, filter?: string): Observable<any> {

    if (filter) {
      //var f = /filter/g;
      var strRegExPattern = filter;
      var filteredData: any = [];
      sub.forEach(function (item, index) {
        //console.log(new RegExp(strRegExPattern, 'gi'));
        var res = item.match(new RegExp(strRegExPattern, 'gi'));
        if (res) {
          //console.log(item);
          filteredData.push(
            //"id":item.id,
            item
          );
        }

      });

      return of(filteredData.slice(0, this.initLoadNum));

    }
    else {

      return of(sub.slice(0, this.initLoadNum));
    }

  }

  addChartSpark(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_chart_spark', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  get_charts(fmls): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get<any>(this.apiEndpoint + 'chart/get_charts/' + fmls, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  addChartResponse(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_chart_response', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  addChartResponseInvestment(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_chart_response_investment', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  add_chart_response_investment_check(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_chart_response_investment_check', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  add_chart_response_investment_check_rental(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/add_chart_response_investment_check_rental', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  save_chart_db(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/save_chart_db', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  sendEmail(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/send_email', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  sharesubmit(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/share_popup_submit', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  editChartResponse(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.post<any>(this.apiEndpoint + 'chart/edit_chart_response', info, { headers: reqHeader }).pipe(
      catchError(this.handleError)
    );
  }

  delete_chart_item(info: any): Observable<any> {

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.post<any>(this.apiEndpoint + 'chart/delete_chart_item', info, { headers: reqHeader }).pipe(
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
