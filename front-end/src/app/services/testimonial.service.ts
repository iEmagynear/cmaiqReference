import { Injectable } from '@angular/core';
import { Observable,throwError, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
  })


export class TestimonailService{
    constructor(private http: HttpClient){}
  
    displayTestimonal(){
      return  this.http.get('../assets/json/testimonial.json');
    }
    
}