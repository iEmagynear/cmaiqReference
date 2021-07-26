import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { ChartService } from "../../services/chart.service";

@Component({
  selector: 'app-edit-user-member',
  templateUrl: './edit-user-member.component.html',
  styleUrls: ['./edit-user-member.component.scss'],
  providers:[DatePipe]
})
export class EditUserMemberComponent implements OnInit {
  currentId: any;

  editMlsUser:any;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  minimumDate = new Date();
  status: boolean = false;
  loader = false;
  //currentmlsid;

  constructor(public route: ActivatedRoute,
    public api: DashboardService,
    private formBuilder: FormBuilder,
    private router:Router,
    private datePipe: DatePipe,public mlsapi: ChartService) { }

  ngOnInit() {

    //this.currentmlsid = localStorage.getItem('mls');
    this.route.params.subscribe(res => {
      this.currentId = res.id;
      //console.log(this.currentId);
      this.validateAddMlsUserForm(this.currentId);
      this.getUser(this.currentId);

    });
    //this.getUser();
    var date = new Date();
    /* console.log(date);
    console.log(this.datePipe.transform(date,"yyyy-MM-dd")); //output : 2018-02-13 */
  }

  toggle(){
    this.status = !this.status;
    if(this.status){
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 250 + 'px';
    }else{
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 80 + 'px';
    }
  }

  getUser(id){
    this.loader = true;
    this.api.get_mls_user(id).subscribe(
    (dataResponse) => {
      let default_mls = localStorage.getItem('mls');
      //console.log(dataResponse.data.mls_specific_data[default_mls].market_center);
      //this.email = dataResponse.data.email;
      this.editMlsUser.controls.firstname.setValue(dataResponse.data.firstname);
      this.editMlsUser.controls.lastname.setValue(dataResponse.data.lastname);
      this.editMlsUser.controls.email.setValue(dataResponse.data.email);
      if(dataResponse.data.mls_specific_data){
        if(dataResponse.data.mls_specific_data[default_mls]){
          this.editMlsUser.controls.market_center.setValue(dataResponse.data.mls_specific_data[default_mls].market_center);
        }
      }
      //console.log(dataResponse.data);
      dataResponse.data.roles.forEach((item) => {
        
        if(item.role == 'member'){

          item.association.forEach((item1) => {
            //console.log(item1);
            //currentmlsid
            if(item1.mls_id == localStorage.getItem('mls')){
              console.log(item1);

              if(item1.payer_type_online == 'true'){
                this.mlsapi.get_user_subscriptions_admin({ "f_mls": localStorage.getItem('mls'),"id":id }).subscribe((dataResponsesub) => {
                  //console.log(dataResponsesub);
                  if (dataResponsesub.payments) {
                    //this.activeplan = true;
                    let plan = dataResponsesub.payments.subscription_plan;
                    console.log(plan);
                    
                    //console.log(plan.indexOf("group"));
  
                    if(plan.indexOf("group") > 0){
                      this.editMlsUser.controls.payer_type_online.setValue('Group');
                    }
                    else if(plan.indexOf("yearly") > 0){
                      this.editMlsUser.controls.payer_type_online.setValue('Individual');
                    }
                    else{
                      this.editMlsUser.controls.payer_type_online.setValue('Individual');
                    }
  
                  }
                  
                },
                error => {
                  console.log(error)
                })
              }
              else if(item1.payer_type_online == 'false' || item1.payer_type_online == null){
                this.editMlsUser.controls.payer_type_online.setValue('Offline');
              }
              else
              {
                if(item1.payer_type_online.toLowerCase() == 'offline'){
                  this.editMlsUser.controls.payer_type_online.setValue('Offline');
                }
                else if(item1.payer_type_online.toLowerCase() == 'individual'){
                  this.editMlsUser.controls.payer_type_online.setValue('Individual');
                }
                else if(item1.payer_type_online.toLowerCase() == 'group'){
                  this.editMlsUser.controls.payer_type_online.setValue('Group');
                }
                
              }

            }
  
            if(item1.expiry && item1.mls_id == localStorage.getItem('mls')){
              //console.log(item1);
              this.editMlsUser.controls.expiry.setValue( this.datePipe.transform( item1.expiry.split('T')[0], 'yyyy-MM-dd') );
            }
          });
          //this.checkmlsadmin = true;
        }
      });
      this.loader = false;
    },
    (error) => {
      console.log(error);
      this.loader = false;

    });
  }

  validateAddMlsUserForm(currentId){

    this.editMlsUser =  this.formBuilder.group({

      _id:[currentId],
      firstname: ['', [ Validators.required]],
      lastname: ['', [ Validators.required]],
      email: ['', [ Validators.maxLength(255),Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      expiry: [''],
      market_center:[''],
      payer_type_online:[''],
      wantsto:[]

    });

  }

  editMlsUserSubmit(){
    console.log(this.editMlsUser.value);
    this.showMsgSuccess = false;
    this.showMsgError = false;
    const body = {
      '_id': this.editMlsUser.value._id,
      'firstname': this.editMlsUser.value.firstname,
      'lastname': this.editMlsUser.value.lastname,
      'expiry': this.editMlsUser.value.expiry,
      'mls_id':localStorage.getItem('mls'),
      'market_center':this.editMlsUser.value.market_center,
      'payer_type_online':this.editMlsUser.value.payer_type_online,
      'wantsto':this.editMlsUser.value.wantsto,
      'email':this.editMlsUser.value.email
    };

    this.api.edit_mls_user(body).subscribe((dataResponse) => {
      console.log(dataResponse);
      this.showMsgSuccess = true;

    },
    (error)=>{
      this.showMsgError = true;
      console.log(error);
      this.errormsg = error.message;
    });
  }

}
