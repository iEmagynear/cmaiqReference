import { Component, OnInit,HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChartService } from "../../../services/chart.service";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers:[ChartService,
    { provide: MatDialogRef }
  ]
})
export class ClientComponent implements OnInit {

  public innerHeight;

  constructor() {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    //console.log(screen.width )
    if (screen.width < 767) {
      this.innerHeight = (window.innerHeight) - 200 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
  }

  ngOnInit() {
  }

}


