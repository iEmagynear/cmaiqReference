import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../services/user.service";
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { IntercomService } from 'src/app/services/intercom.service';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { MlsService } from 'src/app/services/mls.service';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [UserService, // IntercomService
  ]
})

export class SignupComponent implements OnInit {

  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  samlFlag;
  userSignup: FormGroup;
  innerHeight;
  loader = false;
  submitted = false;
  Thankyouforsigningup;
  Thankyouforsigninguptext;
  Thankyouforsigninguptext1;
  Thankyouforsigninguptext2;
  Thankyouforsigninguptext3;
  mlsData = [];
  settings = {};
  selectedItems = [];
  text;
  disableSubmit = false;

  @ViewChild('dropdownElem') dropdownElem: AngularMultiSelect;
  imls_notice: string;
  RAPB_notice: string;
  constructor(public translate: TranslateService, private formBuilder: FormBuilder,
    public api: UserService, private mlsapi: MlsService, private router: Router, private intercomService: IntercomService) {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    if (screen.width < 767) {
      // this.innerHeight = (window.innerHeight) - 160 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 133 + 'px';
    }
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('Sign Out.Thank you for signing up').subscribe((text: string) => {
      //console.log(text);
      this.Thankyouforsigningup = text;
      //console.log(text);
    });

    this.translate.get('Sign Out.Thank you for signing uptext').subscribe((text: string) => {
      //console.log(text);
      this.Thankyouforsigninguptext = text;
      //console.log(text);
    });

    this.translate.get('Sign Out.Thank you for signing uptext1').subscribe((text: string) => {
      //console.log(text);
      this.Thankyouforsigninguptext1 = text;
      //console.log(text);
    });

    this.translate.get('Sign Out.Thank you for signing uptext2').subscribe((text: string) => {
      //console.log(text);
      this.Thankyouforsigninguptext2 = text;
      //console.log(text);
    });

    this.translate.get('Sign Out.Thank you for signing uptext3').subscribe((text: string) => {
      //console.log(text);
      this.Thankyouforsigninguptext3 = text;
      //console.log(text);
    });

    this.translate.get('Sign Out.imls_notice').subscribe((text: string) => {
      //console.log(text);
      this.imls_notice = text;
      //console.log(text);
    });

    this.translate.get('Sign Out.RAPB_notice').subscribe((text: string) => {
      //console.log(text);
      this.RAPB_notice = text;
      //console.log(text);
    });

    
  }

  ngOnInit() {

    if (localStorage.getItem('samlFlag') === 'false') {
      //console.log('Saml active 3')
      this.samlFlag = true;
    } else {
      //console.log("No SAML");
      this.samlFlag = false;
    }

    /* Swal.fire({
      title: "Notice",
      html:
        '<p> Welcome to the APC Residential Pricing & Analytics Tool (APC-R)! If you are a member of Intermountain MLS you already have access to APC-R through Paragon. To use, sign in to your MLS portal and click on the Paragon icon to run a search for comps as usual. After selecting properties for your analysis, go to Actions and click on the APC Pricing Tool icon.</p>' +
        '<p>APC-R is fully integrated into the Corelogic Clareity Dashboard Single Sign On (SSO) and Black Knight’s Paragon MLS platform. This makes APC-R even more powerful for you!</p>' +
        '<p>Message to all APC users: This is the ultimate pricing solution—a true and accurate home valuation based on real-time MLS data, factoring in seasonality and market conditions, and generating a visual and interactive pricing report for you and your clients. If you too would like APC-R fully integrated into your MLS, contact us at contact@apcdata.net.</p>',
      showCancelButton: true,
      cancelButtonText: 'Sign Up',
      confirmButtonText: 'Login to Clareity',
    }).then((result) => {
      if (result.value) {
        console.log("Proceed");
        window.location.href = "https://idp.imls.safemls.net/idp/Authn/UserPassword";
      }
    }); */

    const authResult = localStorage.getItem('token');
    if (authResult) {
      const decoded = jwt_decode(authResult);
      const exp = decoded.exp;
      const ctime = Date.now() / 1000;
      const ctimefix = parseInt(ctime.toFixed(0));
      if (exp < ctimefix) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
      } else {
        this.router.navigate(['/']);
      }
    }

    this.validateSignUpForm();

    this.selectedItems = [];

    //console.log(this.translate.currentLang);

    this.settings = {
      enableFilterSelectAll: false,
      text: this.text,
      enableCheckAll: false,
      limitSelection: 1,
      classes: "myclass custom-class",
      enableSearchFilter: true,
      badgeShowLimit: 1
    };

    this.getMlsLists();
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

  validateSignUpForm() {

    this.userSignup = this.formBuilder.group({
      mlsese: ['', Validators.required],
      yourEmail: ['', [Validators.maxLength(255), Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      firstName: ['', [Validators.maxLength(80), Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
      lastName: ['', [Validators.maxLength(80), Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
      companyName: ['', [Validators.maxLength(200), Validators.required]]

    });
  }

  get userFetch() {
    //console.log(this.userSignup.controls);
    
    return this.userSignup.controls;

  }

  onItemSelect(item:any){
    if(item.itemName == 'RAPB + GFLR'){
      this.disableSubmit = true;
      
      Swal.fire({
        title: "Notice",
        html:
        '<p>'+this.RAPB_notice+'</p>',
        showCancelButton: false,
        allowOutsideClick: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Login to MLS',
      }).then((result) => {
        if (result.value) {
          //console.log("Proceed");
          window.location.href = "http://myrealtordash.com";
        }
      });
    }
    else if(item.itemName == 'Intermountain MLS'){
      this.disableSubmit = true;
      
      Swal.fire({
        title: "Notice",
        html:
        '<p>'+this.imls_notice+'</p>',
        showCancelButton: false,
        allowOutsideClick: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Login to MLS',
      }).then((result) => {
        if (result.value) {
          //console.log("Proceed");
          window.location.href = "https://imls.clareity.net";
        }
      });

    }
    else{
      this.disableSubmit = false;
    }
  }

  OnItemDeSelect(item:any){
    
    this.disableSubmit = false;
    
  } 

  signUpUser() {

    this.submitted = true;
    if (this.userSignup.invalid) {
      return;
    }

    this.showMsgSuccess = false;
    this.showMsgError = false;

    // console.log(this.userSignup.value);

    const body = {
      'mls': this.userSignup.value.mlsese,
      'email': this.userSignup.value.yourEmail,
      'password': this.userSignup.value.password,
      'firstname': this.userSignup.value.firstName,
      'lastname': this.userSignup.value.lastName,
      'companyname': this.userSignup.value.companyName
    };

    /* console.log(body);
    return false;
     */

    this.api.signup(body).subscribe((dataResponse) => {

      const response = dataResponse;
      // console.log(response);
      // this.showMsgSuccess = true;
      this.submitted = false;
      if (this.userSignup.valid) {
        Swal.fire({
          title: this.Thankyouforsigningup,
          // tslint:disable-next-line:max-line-length
          html: '<p>' + this.Thankyouforsigninguptext + '</p>',
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.intercomService.boot();
          this.loader = true;
          if (i > 0) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.intercomService.boot();
            this.router.navigate(['/toa']);
            //this.router.navigate(['/']);
          }
        });
      }
      
      this.userSignup.reset({
        'mlsese': '',
        'yourEmail': '',
        'password': '',
        'firstName': '',
        'lastName': '',
        'companyName': ''
      });

      // console.log(JSON.stringify(response.token))
      // console.log(JSON.stringify(response.data.email))
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      localStorage.setItem('userResponseToken',(response.token));
      const token = response.token;
      localStorage.setItem('token', 'Bearer ' + token);
      const decoded = jwt_decode(token);
      // console.log(decoded);
      const exp = decoded.exp;
      const date = new Date(exp * 1000);
      // console.log(date);
      let i = 0;
      // console.log(dataResponse.data.roles);
      dataResponse.data.roles.forEach((item) => {
        if (item.role == 'mlsadmin') {
          if (dataResponse.data.default_mls_admin) {
            localStorage.setItem('mls', dataResponse.data.default_mls_admin);
          } else {
            if (item.association.length > 0) {
              localStorage.setItem('mls', item.association[0].mls_id);
            }
            // localStorage.setItem('mls', item.association[0].mls_id);
          }

          // console.log(item.association[0].mls_id);
          i++;
        }

        if (item.role == 'member') {
          if (dataResponse.data.default_mls_frontend) {
            localStorage.setItem('f_mls', dataResponse.data.default_mls_frontend);
          } else {
            if (item.association.length > 0) {
              localStorage.setItem('f_mls', item.association[0].mls_id);
            }
          }
          // console.log(item.association[0].mls_id);
          // i++;
        }

      });
    },
      error => {
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      }
    );

  }
}
