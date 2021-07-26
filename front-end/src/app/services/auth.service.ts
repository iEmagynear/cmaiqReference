import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {  IntercomService } from 'src/app/services/intercom.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceLocal {

  constructor(public router:Router, private intercomService: IntercomService) {

  }

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable() };

  notifyUserAction() {
    this._userActionOccured.next();
  }

  loginUser() {
    //console.log('user login');
  }

  logOutUser() {

    //console.log('user logout');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('mls');
    localStorage.removeItem('f_mls');
    localStorage.removeItem('api');
    localStorage.removeItem('page');
    localStorage.removeItem('limit');
    localStorage.removeItem('searchText');
    localStorage.removeItem('sortBy');
    localStorage.removeItem('ascdesc');
    localStorage.removeItem('access_token');
    localStorage.removeItem('investFlag');
    this.intercomService.boot();
    this.router.navigate(['/login']);
  }

}
