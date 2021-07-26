import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from "../../services/user.service";
import { DashboardService } from "../../services/dashboard.service";
import { ChartService } from "../../services/chart.service";
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  successmsg;
  editUSer: any;
  innerHeight;
  loader = false;
  currentId;
  mls_array = [];
  mls_array_admin = [];
  inadmin = false;
  samlFlag = false;
  public image = '';
  public isImage: boolean = false;
  public logoImage = '';
  public isLogo: boolean = false;
  mls_name;
  public mlsName;
  nrSelect: any;
  activeplan = false;
  planstatus;
  planname;
  endDate: number;
  expired: boolean;
  updatepass;// = 'Updating Password?';
  updatepasstext;// = 'Are you sure you want to change your password?';
  APCOfficeSubscription;
  APCMonthlySubscription;
  APCYearlySubscription;
  APCTrialSubscription;
  NoPlanActive;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  currentRequest: any;

  constructor(public translate: TranslateService, private formBuilder: FormBuilder,
    public api: UserService,
    public dashboardapi: DashboardService,
    private router: Router,
    public mlsapi: ChartService) {
  }

  ngOnInit() {
    // console.log(this.router.url);
    this.currentId = JSON.parse(localStorage.getItem('currentUser'))._id;
    // console.log(this.currentId);
    this.getMlsids();
    this.validateForm();
    this.getMlsDetails();
    this.get_user_info();
    if (this.router.url == '/admin/profile') {
      this.inadmin = true;
    } else {
      this.inadmin = false;
    }
    this.nrSelect = localStorage.getItem('f_mls');
    if (localStorage.getItem('samlFlag') === 'true') {
      console.log('Saml Login')
      this.samlFlag = true;
    } else {
      console.log("No SAML");
      this.samlFlag = false;
    }
    window.scroll(0, 0);
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('Sign Out.Updating Password?').subscribe((text: string) => {
      this.updatepass = text;
    });

    this.translate.get('Sign Out.change your password?').subscribe((text: string) => {
      this.updatepasstext = text;
    });

    this.translate.get('My Account.APC Office Subscription').subscribe((text: string) => {
      //console.log(text);
      this.APCOfficeSubscription = text;
    });

    this.translate.get('My Account.APC Monthly Subscription').subscribe((text: string) => {
      //console.log(text);
      this.APCMonthlySubscription = text;
    });

    this.translate.get('My Account.APC Yearly Subscription').subscribe((text: string) => {
      //console.log(text);
      this.APCYearlySubscription = text;
    });

    this.translate.get('My Account.APC Trial Subscription').subscribe((text: string) => {
      //console.log(text);
      this.APCTrialSubscription = text;
    });

    this.translate.get('My Account.No Plan Active').subscribe((text: string) => {
      console.log(text);
      this.NoPlanActive = text;
      this.get_user_info();
    });

  }

  validateForm() {

    this.editUSer = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.minLength(6), Validators.maxLength(30)]],
      firstname: ['', [Validators.maxLength(80), Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
      lastname: ['', [Validators.maxLength(80), Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
      companyname: ['', [Validators.maxLength(200), Validators.required]],
      default_mls_admin: [''],
      default_mls_frontend: [''],
      website: [''],
      phone: [''],
      profile_image: [''],
      logo: ['']

    });
  }

  getMlsids() {

    this.dashboardapi.get_mls_ids_mlsadmin().subscribe(
      (dataResponse) => {
        //console.log(dataResponse);
        this.mls_array_admin = dataResponse.mls_id;

      },
      (error) => {
        console.log(error);
      });

    this.dashboardapi.get_mls_ids_member().subscribe(
      (dataResponse) => {
        //console.log(dataResponse);
        this.mls_array = dataResponse.mls_id;
        this.mls_array.forEach(element => {
          if (element.mls_id == this.nrSelect) {
            this.mlsName = element.mls_name;
            //console.log(this.mlsName);
          }
        });
        this.getmlsUser(this.currentId);
      },
      (error) => {
        //console.log(error);
      });

  }

  getmlsUser(id) {
    this.loader = true;
    this.dashboardapi.get_mls_user(id).subscribe(
      (dataResponse) => {
        //console.log(dataResponse.data);
        this.editUSer.controls.firstname.setValue(dataResponse.data.firstname);
        this.editUSer.controls.lastname.setValue(dataResponse.data.lastname);
        this.editUSer.controls.email.setValue(dataResponse.data.email);
        this.editUSer.controls.companyname.setValue(dataResponse.data.companyname);
        this.editUSer.controls.default_mls_admin.setValue(dataResponse.data.default_mls_admin);
        //console.log(dataResponse.data.default_mls_frontend);
        if (dataResponse.data.default_mls_frontend) {
          //console.log('in');
          this.editUSer.controls.default_mls_frontend.setValue(dataResponse.data.default_mls_frontend);
        }
        else {
          //console.log('ine');
          this.editUSer.controls.default_mls_frontend.setValue('');
          /* if (this.mls_array.length > 0) {
            this.editUSer.controls.default_mls_frontend.setValue(this.mls_array[0].mls_id);
          } */

        }
        this.editUSer.controls.profile_image.setValue(dataResponse.data.profile_image);
        this.image = dataResponse.data.profile_image;
        this.editUSer.controls.website.setValue(dataResponse.data.website);
        this.editUSer.controls.phone.setValue(dataResponse.data.phone);
        this.editUSer.controls.logo.setValue(dataResponse.data.logo);
        this.logoImage = dataResponse.data.logo;
        this.loader = false;
        this.isImage = true;
        this.isLogo = true;
      },
      (error) => {
        console.log(error);
        this.loader = false;

      });
  }

  //edit_mls_user
  editUSerSub() {
    if (this.editUSer.value.password) {
      Swal.fire({
        title: this.updatepass,//'Updating Password?',
        text: this.updatepasstext,//'Are you sure you want to change your password?',
        //type: 'info',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
      }).then((result) => {

        if (result.value) {
          this.updateDetails();
          this.getMlsids();
        }

      });

    }
    else {
      this.updateDetails();

    }

  }

  updateDetails() {
    //console.log(this.editUSer.value);
    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.loader = true;
    const body = {
      '_id': this.currentId,
      'firstname': this.editUSer.value.firstname,
      'lastname': this.editUSer.value.lastname,
      'companyname': this.editUSer.value.companyname,
      'default_mls_admin': this.editUSer.value.default_mls_admin,
      'default_mls_frontend': this.editUSer.value.default_mls_frontend,
      'password': this.editUSer.value.password,
      'profile_image': this.editUSer.value.profile_image,
      'website': this.editUSer.value.website,
      'phone': this.editUSer.value.phone,
      'logo': this.editUSer.value.logo
    };
    //console.log(body.profile_image);
    this.dashboardapi.edit_mls_user_details(body).subscribe((dataResponse) => {
      //console.log(dataResponse);
      this.showMsgSuccess = true;

      if (this.editUSer.value.password) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.successmsg = 'Your password has been changed, logging you off ...';
        setTimeout(eve => {
          this.router.navigate(['/login']);
        }, 4000);
      }
      else {
        this.successmsg = 'Details Updated Successfully!';
      }
      this.loader = false;
      this.onScrollUp();
    },
      (error) => {
        this.showMsgError = true;
        console.log(error);
        this.loader = false;
        this.errormsg = error.message;
      });
  }

  refresh(): void {
    window.location.reload();
  }

  onScrollUp() {
    console.log('scrolled up!!');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  getMlsDetails() {
    var mls = localStorage.getItem('f_mls');
    const body = {
      'id': mls,
    }
    //console.log(mls);
    this.mlsapi.get_mls_details(body).subscribe((dataResponse) => {
      if (dataResponse.data) {
        this.editUSer.controls.default_mls_frontend.setValue(dataResponse.data.name);
        this.mls_name = dataResponse.data.name;
      }

    },
      error => {
        this.loader = false;
        //this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
      })
  }

  onGroup(mls) {
    this.mlsName = mls.mls_name;
    localStorage.setItem('f_mls', mls.mls_id);
    //this.router.navigate(['/'])
    //console.log(mls.mls_name);
    //console.log(this.mlsName);
  }

  mlsSwitch(mls_id) {
    //console.log(mls_id);
    localStorage.setItem('f_mls', mls_id);
    //this.router.navigate(['/'])
    //this.mlsEvent.emit(mls_id);
  }

  showPreviewImage(event: any) {
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.image = event.target.result;
        this.editUSer.controls.profile_image.setValue(this.image);
        this.isImage = true;
        //console.log(this.image);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  showPreviewLogo(event: any) {
    if (event.target.files && event.target.files[0]) {
      var logoReader = new FileReader();
      logoReader.onload = (event: any) => {
        this.logoImage = event.target.result;
        this.editUSer.controls.logo.setValue(this.logoImage);
        this.isLogo = true;
      }
      logoReader.readAsDataURL(event.target.files[0]);
    }
  }

  get_user_info() {

    if (this.currentRequest) {
      this.currentRequest.unsubscribe();
    }

    this.currentRequest = this.mlsapi.get_user_info().subscribe((dataResponse) => {

      dataResponse.data.roles.forEach((item) => {

        if (item.role == 'member') {

          item.association.forEach((item1) => {

            if (item1.mls_id == localStorage.getItem('f_mls')) {

              //console.log(item1);

              if (item1.payer_type_online != null) {

                if (item1.payer_type_online.toLowerCase() != "offline" && item1.payer_type_online.toLowerCase() != 'false') {

                  this.mlsapi.get_user_subscriptions({ "f_mls": localStorage.getItem('f_mls') }).subscribe((dataResponsesub) => {

                    console.log(dataResponsesub);

                    if (dataResponsesub.payments) {
                      this.activeplan = true;
                      let plan = dataResponsesub.payments.subscription_plan;
                      if (plan === "admin") {
                        this.planname = this.APCOfficeSubscription
                      } else if (plan === "monthly_new" || plan === 'monthly_group_new') {
                        this.planname = this.APCMonthlySubscription;
                      } else if (plan === "yearly_new" || plan === 'yearly_group_new') {
                        this.planname = this.APCYearlySubscription;
                      }
                      else if (plan === "free") {
                        this.planname = this.APCTrialSubscription;
                      } else {
                        this.planname = this.NoPlanActive;
                      }

                      this.planstatus = dataResponsesub.payments.status
                      this.endDate = dataResponsesub.payments.subscription_end_date * 1000;
                      let trialExpired = dataResponsesub.payments.subscription_plan === 'free' && dataResponsesub.payments.status === 'active';
                      this.expired = (dataResponsesub.payments.subscription_end_date < Date.now() / 1000 || trialExpired);
                      //console.log(this.expired);
                      //console.log(this.endDate);

                    }
                    else {
                      this.planname = this.NoPlanActive;
                      this.activeplan = false;
                      //this.router.navigate(['/payment']);
                    }
                  },
                    error => {
                      this.planname = this.NoPlanActive;
                      this.activeplan = false;
                      console.log(error)
                    })

                }
                else {
                  this.planname = this.APCOfficeSubscription;

                }

              }
            }
          });

        }

      });
    },
    error => {
      /* this.planname = "No Plan Active";
      this.activeplan = false; */
      console.log(error)
    });

  }

  imageCropped(event: ImageCroppedEvent) {
    this.image = event.base64;
    this.editUSer.controls.profile_image.setValue(this.image);
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
