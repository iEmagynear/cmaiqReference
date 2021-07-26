import { Component, OnInit,HostListener } from '@angular/core';
@Component({
  selector: 'app-fprofile',
  templateUrl: './fprofile.component.html',
  styleUrls: ['./fprofile.component.scss']
})
export class FprofileComponent implements OnInit {
  public innerHeight;
  constructor() {
    this.onResize();
  }

  @HostListener('window:resize')
   onResize() {
     if(screen.width < 767){
      this.innerHeight = (window.innerHeight) - 200 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
  }

  ngOnInit() {
  }

}
