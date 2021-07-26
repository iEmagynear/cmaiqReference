import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { IntercomService } from 'src/app/services/intercom.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  nrSelect;
  firstname
  lastname
  public href: string = "";
  public adminURL:boolean=true;
  mls_array;

  @Output() mlsEvent = new EventEmitter<string>();

  constructor(private location: Location,
    private router : Router,
    public api: DashboardService,public intercomService: IntercomService) {

    this.firstname =  JSON.parse(localStorage.getItem('currentUser')).firstname;
    this.lastname =  JSON.parse(localStorage.getItem('currentUser')).lastname;

    //console.log(this.username);
  }

  ngOnInit() {
    this.getMlsids();
    this.href = this.router.url;
    if(this.href=='/admin/dashboard'){
      this.adminURL = false;

    }

    this.nrSelect = localStorage.getItem('mls');

    //console.log( this.nrSelect );
    //console.log(this.router.url);
  }

  getMlsids(){
    this.api.get_mls_ids().subscribe(
      (dataResponse) => {
        this.mls_array = dataResponse.mls_id;
      },
      (error) => {

      });
  }

  mlsSwitch(mls_id){
    //console.log(mls_id);
    localStorage.setItem('mls', mls_id);
    this.intercomService.boot();
    this.mlsEvent.emit(mls_id);
  }

}
