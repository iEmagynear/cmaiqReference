import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from "../../services/user.service";
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { OnDestroy } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { AuthServiceLocal } from '../../services/auth.service';
import { takeUntil, take } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { ChartService } from "../../services/chart.service";
import { TranslateService } from '@ngx-translate/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService, AuthServiceLocal, // IntercomService
  ]
})

export class LoginComponent implements OnInit {

  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  userLogin: any;
  public innerHeight;
  samlFlag;
  loader = false;
  agree = false;
  public checkAgree = false;
  Disclaimer;
  Disclaimertext1;
  Disclaimertext2;
  Iagree;
  constructor(private socialAuthService: AuthService,public translate: TranslateService, private authService: AuthServiceLocal, private formBuilder: FormBuilder, private intercomService: IntercomService,
    public api: UserService, private router: Router, private chartService: ChartService) {
    this.validateLoginForm();
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    if (screen.width < 767) {
      this.innerHeight = (window.innerHeight) - 200 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('Sign Out.Disclaimer').subscribe((text: string) => {
      this.Disclaimer = text;
      //console.log(text);
    });

    this.translate.get('Sign Out.Disclaimertext1').subscribe((text: string) => {
      this.Disclaimertext1 = text;
    });

    this.translate.get('Sign Out.Disclaimertext2').subscribe((text: string) => {
      this.Disclaimertext2 = text;
    });

    this.translate.get('Sign Out.I agree').subscribe((text: string) => {
      this.Iagree = text;
    });

  }

  ngOnInit() {
    //Swal.fire('Hello world!');

    if (localStorage.getItem('samlFlag') === 'false') {
      //console.log('Saml Active')
      this.samlFlag = true;
    } else {
      //console.log("No SAML");
      this.samlFlag = false;
    }

    const authResult = localStorage.getItem('token');
    //console.log(authResult)
    if (authResult) {
      const decoded = jwt_decode(authResult);
      //console.log(decoded);
      const exp = decoded.exp;
      const ctime = Date.now() / 1000;
      const ctimefix = parseInt(ctime.toFixed(0));
      if (exp < ctimefix) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
      } else {
        console.log('redirect to home');
        
        this.router.navigate(['/']);
      }
    }

  }

  validateLoginForm() {

    this.userLogin = this.formBuilder.group({

      email: ['', [Validators.maxLength(255), Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]

    });
  }

  loginUser() {
    this.showMsgSuccess = false;
    this.showMsgError = false;
    localStorage.removeItem('samlFlag');
    //console.log(this.userLogin.value);
    this.loader = true;
    const body = {

      'email': this.userLogin.value.email,
      'password': this.userLogin.value.password,

    };
    this.checkAgree = false;
    this.api.login(body).subscribe((dataResponse) => {

      const response = dataResponse;

      //console.log(this.userLogin.value);
      this.loader = false;
      if (!response.data.is_Agree) {
        Swal.fire({
          title: this.Disclaimer,
          html: '<h6>' + this.Disclaimertext1 + '</h6>' + '<h6>' + this.Disclaimertext2 + '<h6><h6><input type="checkbox" name="checkbox" id="agreedis" > ' + this.Iagree + '</h6>',
          //type: 'info',
          width: '42em',
          showCancelButton: true,
          cancelButtonText: 'I DISAGREE',
          confirmButtonText: 'I AGREE'
        }).then((result) => {
          if (result.value) {
            //this.gotoDashboard(response, dataResponse);
            const body = {
              'is_Agree': this.checkAgree,
              '_id': response.data._id
            };
            this.api.agree(body).subscribe((dataResponse) => {
              //console.log(dataResponse);
              if (!response.data.toa_Check) {
                //console.log(response.data.toa_Check)
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                localStorage.setItem('userResponseToken', (response.token));
                this.router.navigate(['/toa']);
              } else {
                this.gotoDashboard(response, dataResponse);
              }
            });
          }
          else if (result.dismiss === Swal.DismissReason.cancel) {
          }
          else {
          }
        });


        setTimeout(() => {

          let checkbox = document.getElementById("agreedis");
          var element = document.querySelector(".swal2-confirm");
          element.classList.add("inactive");
          //console.log(checkbox);
          if (checkbox) {

            // TODO: Attaching sample click listener. Remove it.
            checkbox.addEventListener('change', e => {
              this.checkAgree = !this.checkAgree;

              if (this.checkAgree == true) {
                element.classList.remove("inactive");
                element.classList.add("active");
                //console.log(element);
              } else {
                element.classList.remove("active");
                element.classList.add("inactive");
              }
            }, false);

            // element.click();

          }

        }, 100);
      } else {
        //console.log(response);
        if (!response.data.toa_Check) {
          //console.log(response.data.toa_Check)
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          localStorage.setItem('userResponseToken', (response.token));
          this.router.navigate(['/toa']);
        } else {
          this.gotoDashboard(response, dataResponse);
        }
        //this.gotoDashboard(response, dataResponse);

      }

      // console.log(dataResponse);

    },
      error => {
        // -----
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
    });
  }
  /**
   * method for redirect to dashboard
   */
  gotoDashboard(response, dataResponse) {

    this.showMsgSuccess = true;
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    const token = response.token;
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


    //console.log(dataResponse.data.roles);
    dataResponse.data.roles.forEach((item) => {
      //console.log(item);
      if (item.role == 'mlsadmin') {
        if (dataResponse.data.default_mls_admin) {
          localStorage.setItem('mls', dataResponse.data.default_mls_admin);
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
        //console.log(dataResponse.data);
        if (dataResponse.data.default_mls_frontend) {
          localStorage.setItem('f_mls', dataResponse.data.default_mls_frontend);
          if (dataResponse.f_mls_isupload != null && dataResponse.f_mls_isupload != '') {
            localStorage.setItem('f_mls_isupload', dataResponse.f_mls_isupload);
          }
          else
            localStorage.setItem('f_mls_isupload', 'false');
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
      this.router.navigate(['/admin/dashboard']);
    }
    else {
      this.intercomService.boot();
      this.router.navigate(['/']);
    }

  }

  public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "linkedin") {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }
    
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.socialloginUser(userData,socialPlatform);
        // Now sign-in with userData
        // ...
            
      }
    );
  }

  socialloginUser(userData,socialPlatform) {
    //console.log(userData.token);
    //return;
    this.showMsgSuccess = false;
    this.showMsgError = false;
    localStorage.removeItem('samlFlag');
    //console.log(this.userLogin.value);
    this.loader = true;
    const body = {'token':userData.token,'socialPlatform':socialPlatform};
    this.checkAgree = false;
    this.api.sociallogin(body).subscribe((dataResponse) => {
      //console.log(dataResponse);
      //return
      
      const response = dataResponse;

      //console.log(this.userLogin.value);
      this.loader = false;

      if (!response.data.is_Agree) {
        Swal.fire({
          title: this.Disclaimer,
          html: '<h6>' + this.Disclaimertext1 + '</h6>' + '<h6>' + this.Disclaimertext2 + '<h6><h6><input type="checkbox" name="checkbox" id="agreedis" > ' + this.Iagree + '</h6>',
          //type: 'info',
          width: '42em',
          showCancelButton: true,
          cancelButtonText: 'I DISAGREE',
          confirmButtonText: 'I AGREE'
        }).then((result) => {
          if (result.value) {
            //this.gotoDashboard(response, dataResponse);
            const body = {
              'is_Agree': this.checkAgree,
              '_id': response.data._id
            };
            this.api.agree(body).subscribe((dataResponse) => {
              //console.log(dataResponse);
              if (!response.data.toa_Check) {
                //console.log(response.data.toa_Check)
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                localStorage.setItem('userResponseToken', (response.token));
                this.router.navigate(['/toa']);
              } else {
                this.gotoDashboard(response, dataResponse);
              }
            });
          }
          else if (result.dismiss === Swal.DismissReason.cancel) {
          }
          else {
          }
        });


        setTimeout(() => {

          let checkbox = document.getElementById("agreedis");
          var element = document.querySelector(".swal2-confirm");
          element.classList.add("inactive");
          //console.log(checkbox);
          if (checkbox) {

            // TODO: Attaching sample click listener. Remove it.
            checkbox.addEventListener('change', e => {
              this.checkAgree = !this.checkAgree;

              if (this.checkAgree == true) {
                element.classList.remove("inactive");
                element.classList.add("active");
                //console.log(element);
              } else {
                element.classList.remove("active");
                element.classList.add("inactive");
              }
            }, false);

            // element.click();

          }

        }, 100);
      } else {
        //console.log(response);
        if (!response.data.toa_Check) {
          //console.log(response.data.toa_Check)
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          localStorage.setItem('userResponseToken', (response.token));
          this.router.navigate(['/toa']);
        } else {
          this.gotoDashboard(response, dataResponse);
        }
        //this.gotoDashboard(response, dataResponse);

      }

      // console.log(dataResponse);

    },
      error => {
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        if(error.message =='new user'){
          this.errormsg = "You do not have account with us. Kindly create new account.";
        }
        else{
          this.errormsg = error.message;
        }
        
    });
  }

  
}
