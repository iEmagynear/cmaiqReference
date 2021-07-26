import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPropertyComponent } from '../../new-chart/dialog-property/dialog-property.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IntercomService } from 'src/app/services/intercom.service';
import { UserService } from "../../../services/user.service";
import { AuthServiceLocal } from '../../../services/auth.service';
import { ChartService } from "../../../services/chart.service";
import * as jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-toa',
  templateUrl: './toa.component.html',
  styleUrls: ['./toa.component.scss'],
  providers: [UserService, AuthServiceLocal]
})
export class TOAComponent implements OnInit {

  loader = false;
  toaCheckAgree = false;
  userItem = null;
  userDataResponse = null;
  userResponseToken = null;
  agreeView = false;


  public innerHeight;



  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthServiceLocal,
    public api: UserService,
    private intercomService: IntercomService,
    private chartService: ChartService,
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
    this.userItem = JSON.parse(localStorage.getItem('currentUser'));
    this.userResponseToken = localStorage.getItem('userResponseToken');
    //console.log("User Item 2: " + this.userItem);
    if(this.userItem != null && !this.userItem.toa_Check){
      this.agreeView = true;
    }  else {
      console.log("False")
      this.agreeView = false;
    }


  }

  toaCheckSubmit(){
    console.log("Go forth")
    console.log(this.toaCheckAgree);
    const body = {
      'toa_Agree': this.toaCheckAgree,
      '_id': this.userItem._id
    };
    this.api.toaAgree(body).subscribe((dataResponse) => {
      console.log("Success")
      console.log(dataResponse);
      this.gotoDashboard();
    });
  }

  toaCheckValid(){
    this.toaCheckAgree = !this.toaCheckAgree;
  }

  setFromTOA(){
    console.log("Set TOA")
    localStorage.setItem('toaFlag', "true");
  }

  gotoDashboard() {

    const token = this.userResponseToken;
    localStorage.setItem('token', 'Bearer ' + token);
    const decoded = jwt_decode(token);

    const exp = decoded.exp;
    const date = new Date(exp * 1000);
    let i = 0;

    this.chartService.get_user_all_subscriptions().subscribe((dataResponsesub) => {
      //console.log(dataResponsesub);
      if (dataResponsesub.payments) {
      }
    },
      error => {
        console.log(error);
      });

    //return false;


    //console.log(this.userItem.roles);
    this.userItem.roles.forEach((item) => {
      //console.log(item);
      if (item.role == 'mlsadmin') {
        if (this.userItem.default_mls_admin) {
          localStorage.setItem('mls', this.userItem.default_mls_admin);
        }
        else {
          if (item.association.length > 0) {

            item.association.forEach((itemmls) => {
              if (itemmls.mls_id) {
                localStorage.setItem('mls', itemmls.mls_id);
              }

            });

          }
          //localStorage.setItem('mls', item.association[0].mls_id);
        }

        //console.log(item.association[0].mls_id);
        i++;
      }

      if (item.role == 'member') {
        //console.log(this.userItem.default_mls_frontend);
        if (this.userItem.default_mls_frontend) {
          localStorage.setItem('f_mls', this.userItem.default_mls_frontend);
        }
        else {
          if (item.association.length > 0) {
            item.association.forEach((itemmls) => {
              //console.log(itemmls);
              if (itemmls.mls_id) {
                localStorage.setItem('f_mls', itemmls.mls_id);
              }
            });

            //localStorage.setItem('f_mls', item.association[0].mls_id);
          }

        }

        //console.log(item.association[0].mls_id);
        //i++;
      }

    });

    if (i > 0) {
      this.intercomService.boot();
      if (localStorage.getItem('queryListingid') != null) {
        localStorage.removeItem('ClareityCheck');
        localStorage.removeItem('userResponseToken');

        this.router.navigate(['/paragonSubmit']);
      } else {
        localStorage.removeItem('ClareityCheck');
        localStorage.removeItem('userResponseToken');

        this.router.navigate(['/admin/dashboard']);
      }
    }
    else {
      this.intercomService.boot();
      if (localStorage.getItem('queryListingid') != null) {
        localStorage.removeItem('ClareityCheck');
        localStorage.removeItem('userResponseToken');

        this.router.navigate(['/paragonSubmit']);
      } else {
        localStorage.removeItem('ClareityCheck');
        localStorage.removeItem('userResponseToken');

        this.router.navigate(['/']);
      }

    }

  }


}
