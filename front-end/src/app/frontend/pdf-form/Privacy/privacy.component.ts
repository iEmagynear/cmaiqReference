import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPropertyComponent } from '../../new-chart/dialog-property/dialog-property.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartService } from 'src/app/services/chart.service';
import { StatusService } from "../../../services/status.service";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  providers: [StatusService]
})
export class PrivacyComponent implements OnInit {

  loader = false;
  toaFlag = false;
  eulaFlag = false;


  public innerHeight;


  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private api: ChartService,
    public statusService: StatusService,
    private router: Router) {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    if (screen.width < 767) {
      this.innerHeight = (window.innerHeight) - 190 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 130 + 'px';
    }
  }

  ngOnInit() {
    if (localStorage.getItem("toaFlag") === "true") {
      this.toaFlag = true;
      console.log("Show TOA")
      localStorage.removeItem("toaFlag");
    } else {
      console.log("Normal")
    }

    if (localStorage.getItem("eulaFlag") === "true") {
      this.eulaFlag = true;
      localStorage.removeItem("eulaFlag");
    } else {
      console.log("Normal")
    }

  }


}
