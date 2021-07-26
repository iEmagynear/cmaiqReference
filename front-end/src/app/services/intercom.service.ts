import { Injectable } from '@angular/core';
import { Intercom } from 'ng-intercom';
import { DashboardService } from './dashboard.service';

@Injectable({
    providedIn: 'root',
  })


export class IntercomService {
    private _isBooted = false;
    private _isBootedWithUserData = false;
    mls_array: any;
    nrSelect: string;
    mlsName: any;
    nrSelectfmls: string;
    nrSelectmls: string;
  mls_array2: any;
  mls_array1: any;
    constructor(private intercom: Intercom,public dashboardapi: DashboardService) {
      //console.log('Intercom service constructor called...');
    }

    public isBooted() {
      return this._isBooted;
    }

    public isBootedWithUserData() {
      return this._isBootedWithUserData;
    }

    boot() {
      if(this._isBooted){
        //console.log('shutdown intercom');
        this.intercom.shutdown();
      }

      this._isBooted = true;
      const intercomData = {
        app_id: 'psa4d174',
          // Supports all optional configuration.
          widget: {
            'activator': '#intercom'
          }
      };
      //console.log(localStorage.getItem('currentUser'));
      if (localStorage.getItem('currentUser') != null) {
        //console.log('Booting intercom with user...');
        this._isBootedWithUserData = true;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.nrSelectmls = localStorage.getItem('mls');
        this.nrSelectfmls = localStorage.getItem('f_mls');
        intercomData['email'] = currentUser.email;
        intercomData['companyName'] = currentUser.companyname;
        intercomData['name'] = currentUser.firstname + ' ' + currentUser.lastname;

        //console.log(intercomData)
        /* console.log(currentUser.mls_specific_data)
        console.log(this.nrSelectmls)
        console.log(this.nrSelectfmls) */

        if(this.nrSelectmls != null){
          //console.log(1);
          intercomData['UserRole'] = "MLS Admin";
          //console.log(currentUser.mls_specific_data[this.nrSelectmls]);
          if(currentUser.mls_specific_data){
            if(currentUser.mls_specific_data[this.nrSelectmls]){
              intercomData['marketCenter'] = currentUser.mls_specific_data[this.nrSelectmls].market_center;
            }
          }

        }
        else if(this.nrSelectfmls != null){
          //console.log(2);
          intercomData['UserRole'] = "Member";
          //console.log(currentUser.mls_specific_data[this.nrSelectfmls]);
          if(currentUser.mls_specific_data){
            if(currentUser.mls_specific_data[this.nrSelectfmls]){
              intercomData['marketCenter'] = currentUser.mls_specific_data[this.nrSelectfmls].market_center;
            }
          }
        }
        else
        {
          let i3 = 0;
          currentUser.roles.forEach((item) => {
            if (item.role == 'superadmin') {
              i3++;
            }
          });
          //console.log(i3);
          //console.log(currentUser.roles.length)
          if(i3 == currentUser.roles.length){
            intercomData['UserRole'] = "Super Admin";
          }
        }

        if(this.nrSelectmls){
          //console.log(3);
          //this.nrSelect = this.nrSelectmls
          let i2 = 0;
          this.dashboardapi.get_mls_ids().subscribe(
          (dataResponse) => {
            //console.log(dataResponse);
            this.mls_array1 = dataResponse.mls_id;
            this.mls_array1.forEach(element => {
              //console.log(element);
              if(element.mls_id == this.nrSelectmls){
               this.mlsName = element.mls_name;
              }

              i2++

             });

             if(i2 == this.mls_array1.length){
              if(this.mlsName){
                intercomData['mls'] = this.mlsName;
                //console.log(intercomData);
                this.intercom.boot(intercomData);
              }
              else
              {
                //console.log(intercomData);
                this.intercom.boot(intercomData);
              }
            }
          },
          (error) => {
            console.log(error);
          });
        }
        else if(this.nrSelectfmls){
          //console.log(4);
          //this.nrSelect = this.nrSelectfmls
          let i1 = 0;
          setTimeout(eve => {
            this.dashboardapi.get_mls_ids_member().subscribe(
              (dataResponse) => {
                this.mls_array2 = dataResponse.mls_id;
                this.mls_array2.forEach(element => {
                 if(element.mls_id == this.nrSelectfmls){
                  this.mlsName = element.mls_name;
                 }
  
                 i1++
  
                });
  
                if(i1 == this.mls_array2.length){
                  if(this.mlsName){
                    intercomData['mls'] = this.mlsName;
                    //console.log(intercomData);
                    this.intercom.boot(intercomData);
                  }
                  else
                  {
                    //console.log(intercomData);
                    this.intercom.boot(intercomData);
                  }
                }
  
              },
              (error) => {
                console.log(error);
              });
          }, 4000);
          
        }
        else
        {
          //console.log(5);
          //console.log(intercomData);
          this.intercom.boot(intercomData);
        }

        //console.log(intercomData);
      } else {
        //console.log(intercomData);
        //console.log('Booting intercom without user...');
        this._isBootedWithUserData = false;
        //console.log(intercomData);
        this.intercom.boot(intercomData);
      }


    }
}
