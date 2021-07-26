import { Component, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceLocal } from './services/auth.service';
import { IntercomService } from './services/intercom.service';
import { OnDestroy } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'frontend';
  loginFlag = false;
  samlFlag = false;
  minutesDisplay = 0;
  secondsDisplay = 0;
  endTime = 1;
  intitle;// = 'Inactivity Notice';
  intext;//= 'You have been logged out after 30 minutes of inactivity for security reasons.';
  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  constructor(public translate: TranslateService, private modalService: NgbModal, private router: Router, private authService: AuthServiceLocal, private intercomService: IntercomService) {
    //if (localStorage.getItem('currentUser') != null) {
    this.loginFlag = true;
    this.authService.loginUser();
    this.resetTimer();
    this.authService.userActionOccured.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.resetTimer();
    });
    //}

  }

  showMessageFromChild(message: any) {
    //console.log(message);
    this.translate.get('Sign Out.Inactivity Notice').subscribe((text: string) => {
      this.intitle = text;
    });
    this.translate.get('Sign Out.You have been').subscribe((text: string) => {
      this.intext = text;
    });
  }

  ngOnInit() {
    /*if (!this.intercomService.isBooted()) {
      console.log('inside header, calling intercom boot');
      this.intercomService.boot();
    }*/
  }

  ngAfterViewInit() {
  }

  onActivate(event) {
    window.scroll(0, 0);

  }

  @HostListener('document:keyup', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:wheel', ['$event'])
  resetTimerr() {
    //console.log('trigger')
    this.authService.notifyUserAction();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  resetTimer(endTime: number = this.endTime) {
    //console.log('reset timmer');
    const interval = 1000;
    const duration = endTime * 60 * 30;
    //const duration = endTime * 60;
    this.timerSubscription = timer(0, interval).pipe(
      take(duration)
    ).subscribe(value =>
      this.render((duration - +value) * interval),
      err => { },
      () => {
        if (localStorage.getItem('currentUser')) {
          this.modalService.dismissAll();
          Swal.fire({
            title: this.intitle,
            text: this.intext,
          });
          //console.log('logout');
          this.authService.logOutUser();
        }

      }
    )
  }

  private render(count) {
    this.secondsDisplay = this.getSeconds(count);
    this.minutesDisplay = this.getMinutes(count);
    //console.log(this.secondsDisplay,this.minutesDisplay)
  }

  private getSeconds(ticks: number) {
    const seconds = ((ticks % 60000) / 1000).toFixed(0);
    return this.pad(seconds);
  }

  private getMinutes(ticks: number) {
    const minutes = Math.floor(ticks / 60000);
    return this.pad(minutes);
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }


}
