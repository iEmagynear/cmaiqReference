import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private messageSource = new BehaviorSubject('English');
  currentMessage = this.messageSource.asObservable();

  private curSource = new BehaviorSubject('USD');
  currentcur = this.curSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    //console.log(message);
    this.messageSource.next(message)
  }

  changeCur(message: string) {
    //console.log(message);
    this.curSource.next(message)
  }
}
