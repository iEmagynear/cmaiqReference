import { Component, OnInit,HostListener,EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { UserService } from "../../services/user.service";
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { IntercomService } from 'src/app/services/intercom.service';
import { MlsService } from 'src/app/services/mls.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
    mlsData = [];
  public innerHeight;
  nrSelect;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  contactUs:any;
  loader = false;
  mls_array;

  @Output() mlsEvent = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
    public api: UserService,private mlsapi: MlsService,private router:Router,public intercomService: IntercomService) {

    this.onResize();
    //console.log(this.username);
  }

  // constructor(private formBuilder: FormBuilder,
  //   public api: UserService,private router:Router) {
  //   this.onResize();
  // }

  @HostListener('window:resize')
   onResize() {
     if(screen.width < 767){

    } else {
      this.innerHeight = (window.innerHeight) - 194 + 'px';
    }
   }

   ngOnInit() {
     this.getMlsLists();
     this.validateContactUsForm();
     this.nrSelect = localStorage.getItem('mls');
   }

   getMlsLists() {
     this.loader = true;
     this.mlsapi.getMlsListNonLogin()
       .subscribe((dataResponse) => {
         //console.log("Old Data: ", dataResponse);
         var mlsPreData = dataResponse;
         mlsPreData.sort(function(a, b) {
           var nameA = a.itemName.toLowerCase(), nameB = b.itemName.toLowerCase()
           if (nameA < nameB) //sort string ascending
             return -1
           if (nameA > nameB)
             return 1
           return 0 //default return value (no sorting)
         })
         // console.log("New Data: ", mlsPreData);
         this.mlsData = mlsPreData;
         console.log("Final Data: ", this.mlsData)
         //this.dropdownElem.openDropdown();
         //console.log(this.mlsData);
         this.loader = false;
       },
       (error) => {
         this.loader = false;
         console.log(error)
       });
   }


  validateContactUsForm(){
    this.contactUs =  this.formBuilder.group({

      name: ['', [ Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
      email: ['', [ Validators.maxLength(255),Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      message: ['',[Validators.required,Validators.minLength(5)]],
      mlsName: ['',[Validators.required]],
      companyname: ['',[]]

    });
  }

  contactUsSubmit(){

    //console.log(this.contactUs.value)

    //contact-us
    this.loader = true;
    this.showMsgSuccess = false;
    this.showMsgError = false;

    //console.log(this.userLogin.value);

    const body = {
      'name': this.contactUs.value.name,
      'email': this.contactUs.value.email,
      'message': this.contactUs.value.message,
      'companyname': this.contactUs.value.companyname,
      'mlsName': this.contactUs.value.mlsName,
    };

    this.api.contactUs(body).subscribe((dataResponse) => {

        const response = dataResponse;
        this.showMsgSuccess = true;

        this.contactUs.reset({
          'name': '',
          'email': '',
          'message': '',
          'mlsName': '',
          'companyname': '',
        });
        this.loader = false;
      },
      error => {
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
        this.loader = false;
      }
    );

  }
  getMlsids(){
    this.api.get_mls_ids().subscribe(
      (dataResponse) => {
        this.mls_array = dataResponse.mls_id;
      },
      (error) => {

      });
  }

}
