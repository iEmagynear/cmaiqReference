import { Component, OnInit, ViewChild } from '@angular/core';
import { TestimonailService } from '../../services/testimonial.service';
import { DashboardService } from "../../services/dashboard.service";
import { UserService } from "../../services/user.service";
import { TranslateService } from '@ngx-translate/core';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { MlsService } from 'src/app/services/mls.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DashboardService],

})
export class HomeComponent implements OnInit {
  mlsData = [];
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: true
  }
  settings = {};
  selectedItems = [];
  @ViewChild('dropdownElem') dropdownElem: AngularMultiSelect;
  public myInterval = 6000;
  public clientTestimonials = [];
  public userslength: any;
  users = [];
  eventList = new Array<string>();
  loader = false;
  request;
  public loginFlag = false;
  public mls;
  public stisfiedCustomer;
  public salesRent;
  contactUs:any;
  public showThis: any;

  constructor(private formBuilder: FormBuilder,private mlsapi: MlsService,private testimonial: TestimonailService, public dashboardApi: DashboardService, public userApi: UserService, public translate: TranslateService) {
    if (localStorage.getItem('currentUser') != null) {
      this.loginFlag = true;
    }
  }

  ngOnInit() {
    this.settings = {
      enableFilterSelectAll: false,
      //text: this.text,
      enableCheckAll: false,
      limitSelection: 1,
      classes: "myclass custom-class",
      enableSearchFilter: true,
      badgeShowLimit: 1
    };
    this.getNews();
    this.getTestimonal();
    this.ticker();
    this.getMlsLists();
    this.validateContactUsForm();
  }

  validateContactUsForm(){
    this.contactUs =  this.formBuilder.group({

      name: ['', [ Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
      mymls: ['',[Validators.required]],
      email: ['', [ Validators.maxLength(255),Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      message: ['',[Validators.required]]

    });
  }

  getNews(){

    this.loader = true;
    //console.log(body);

    this.dashboardApi.get_news().subscribe( (dataResponse) => {
      // await dataResponse;
      //console.log(dataResponse);
      dataResponse.forEach(element => {
        this.eventList.push(element.content);
      });
      //console.log(this.eventList);
      
      this.loader = false;
      //this.showMsgSuccess = false;
      //this.showMsgError = false;
    },
    (error) => {
      //this.showMsgError = true;
      console.log(error);
      this.loader = false;
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
      'mymls': this.contactUs.value.mymls,
      'message': this.contactUs.value.message,
    };

    this.userApi.contactUs(body).subscribe((dataResponse) => {

        const response = dataResponse;
        this.showMsgSuccess = true;

        this.contactUs.reset({
          'name': '',
          'email': '',
          'mymls':"",
          'message': ''
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

  onItemSelect(item:any){
    
  }

  OnItemDeSelect(item:any){
    
    
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
        //console.log("New Data: ", mlsPreData);
        this.mlsData = mlsPreData;
        //console.log("Final Data: ", this.mlsData)
        //this.dropdownElem.openDropdown();
        //console.log(this.mlsData);
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        console.log(error)
      });
  }

  getTestimonal() {
    let _this = this;
    this.testimonial.displayTestimonal().subscribe((res: any) => {
      this.clientTestimonials = [];
      //console.log(res.testimonials);
      /* this.clientTestimonials.push() */
      res.testimonials.forEach(function(element, index) {

        var body = {
          'id': element.id,
          'clientName': element.clientName,
          'clientDesignation': element.clientDesignation,
          'description': element.description,
          'icon': element.icon
        }

        _this.translate.get('Testimonials.Testimonials' + element.id).subscribe((text: string) => {
          //console.log(text);
          body.description = text;

        });

        //console.log(body);
        _this.clientTestimonials.push(body);
      });

      //console.log(this.clientTestimonials);
      //console.log(this.clientTestimonials);
    })
  }

  showMessageFromChild(message: any) {
    this.getTestimonal();

  }

  ticker() {
    this.loader = true;
    this.request = this.userApi.ticker().subscribe(
      async (dataResponse) => {
        this.mls = dataResponse.MLS;
        this.stisfiedCustomer = dataResponse.SATISFIED_CUSTOMER;
        this.salesRent = dataResponse.SALES_RENTS;

        this.loader = false;
      },
      (error) => {
        this.loader = false;
      });
  }



}
