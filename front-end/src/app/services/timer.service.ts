import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TimerService{

  constructor(){}

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable() };

  notifyUserAction() {
    this._userActionOccured.next();
  }

}
