import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedMlsService {
  private subject = new BehaviorSubject('');
  currentMlsId = this.subject.asObservable();

    // Observable string source
    private dataStringSource = new Subject<string>();
    // Observable string stream
    dataString$ = this.dataStringSource.asObservable();

    // Observable string source
    private dataStringSource2 = new Subject<string>();
    // Observable string stream
    dataString2$ = this.dataStringSource2.asObservable();

  constructor() { }

  changeMlsId(data: any) {
    this.subject.next(data)
  }

  public setsearchPropertiesdata(searchPropertiesdata:any) {
    
    this.dataStringSource.next(searchPropertiesdata);

  }

  public setCurrency(currencydata:any) {
    
    this.dataStringSource2.next(currencydata);

  }
}


// private showTabs = new BehaviorSubject(false);
//   currentStateOfTabs = this.showTabs.asObservable();

//   constructor() { }

//   changeStateOfTabs(tab: boolean) {
//     this.showTabs.next(tab)
//   }