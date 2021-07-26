import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { IntercomService } from 'src/app/services/intercom.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  providers:[DatePipe]
})
export class LeftSidebarComponent implements OnInit {
  checkmlsadmin = false;
  checkSuperAdmin = false;
  currentDate;
  currentId;
  superAdminDashboard = true;
  constructor(private datePipe: DatePipe,
    public router:Router,
    private dashboardApi: DashboardService,
    public intercomService: IntercomService) {

    setInterval(() => {
      this.currentDate = this.datePipe.transform(new Date(),"EEEE, MMM d, y, h:mm a");
    }, 1);

  }

  ngOnInit() {
    //this.currentDate = this.datePipe.transform(new Date(),"EEEE, MMM d, y, h:mm a");
    if(localStorage.getItem('currentUser')){

      this.currentId =  JSON.parse(localStorage.getItem('currentUser'))._id;
      this.dashboardApi.get_mls_user(this.currentId).subscribe(
        (dataResponse) => {

          dataResponse.data.roles.forEach((item) => {
            if(item.role == 'mlsadmin'){
              this.checkmlsadmin = true;
            }

            if(item.role == 'superadmin'){
              //this.loginFlag = false;
              //this.checkmlsadmin = false;
              this.checkSuperAdmin = true;
            }
          });
        },
        (error) => {
          console.log(error.status);
        });
    }
  }

  signout() {

    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('mls');
    localStorage.removeItem('f_mls');
    localStorage.removeItem('api');
    localStorage.removeItem('page');
    localStorage.removeItem('limit');
    localStorage.removeItem('searchText');
    localStorage.removeItem('sortBy');
    localStorage.removeItem('ascdesc');
    localStorage.removeItem('access_token');
    this.intercomService.boot();
    this.router.navigate(['/login']);
  }

}
