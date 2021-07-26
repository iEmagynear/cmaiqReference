import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { IntercomService } from '../services/intercom.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private routes: Router, private intercomService: IntercomService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      // console.log(localStorage.getItem('currentUser'));
      if (localStorage.getItem('currentUser') != null) {
        if (!this.intercomService.isBootedWithUserData) {
          console.log('in Authguard, need to boot intercom with user');
          this.intercomService.boot();
        }
        return true;
      } else {
        if (this.intercomService.isBootedWithUserData) {
          this.intercomService.boot();
        }
        this.routes.navigate(['/login']);
        return false;
      }
  }

}
