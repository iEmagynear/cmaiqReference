import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../services/user.service";
import { DialogPropertyComponent } from '../new-chart/dialog-property/dialog-property.component';
import { DashboardService } from "../../services/dashboard.service";
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IntercomService } from 'src/app/services/intercom.service';
import { ChartService } from "../../services/chart.service";
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-shibboleth',
  templateUrl: './shibboleth.component.html',
  styleUrls: ['./shibboleth.component.scss'],
  providers: [UserService]
})
export class ShibbolethComponent implements OnInit {

  loader = false;
  public innerHeight;
  params;
  Id;
  loginFlag = false;
  samlFlag = 'false';
  apiEndpoint: any;
  samlUserObj;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  userLogin: any;
  agree = false;
  public checkAgree = false;
  Iagree;
  submitted = false;
  parsedEmail = null;mlsname: any;
;
  parsedPass = null;
  parsedUser;
  ssoValid;
  savedUser = null;
  redis_token;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public api: UserService,
    public dashApi: DashboardService,
    private http: HttpClient,
    private router: Router,
    private intercomService: IntercomService,
    private chartService: ChartService) {
    this.apiEndpoint = environment.APIEndpoint
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

  clearLocalStorageIint(){

    localStorage.removeItem('token');
    localStorage.removeItem('samlFlag');
    localStorage.removeItem('investFlag');
    localStorage.removeItem('mls');
    localStorage.removeItem('f_mls');
    localStorage.removeItem('api');
    localStorage.removeItem('page');
    localStorage.removeItem('limit');
    localStorage.removeItem('searchText');
    localStorage.removeItem('sortBy');
    localStorage.removeItem('ascdesc');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userResponseToken');
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('ClareityCheck');
    console.log('deleted local storage');
    
  }

  ngOnInit() {

    this.clearLocalStorageIint();

    //console.log(this.apiEndpoint);
    if (localStorage.getItem('queryAgentemail') != null || localStorage.getItem('queryAgentemail') != undefined) {
      localStorage.setItem('ClareityCheck', 'false');
      localStorage.setItem('investFlag', 'false');
    } else {      
      localStorage.setItem('ClareityCheck', 'true');
      localStorage.setItem('investFlag', 'true');
    }

    //console.log( localStorage.getItem('currentUser') );

    if (localStorage.getItem('currentUser') != null || localStorage.getItem('currentUser') != undefined) {
      this.savedUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log ("User");
      console.log(this.savedUser)
    } else {
      //console.log ("No User");
    }

    this.route.params.subscribe(res => {
      this.redis_token = res.redis_token;
      this.mlsname = res.mlsname;
      console.log(this.redis_token);
      // SAML Start
      this.samlStart();
    });

    
  }

  samlStart() {
    console.log('samlStart');
    
    let info = {
      'ssotoken': this.redis_token
    };
    
    console.log(this.mlsname);
    
    this.api.userCapture(info).subscribe((dataResponse) => {
      //console.log(dataResponse);
      this.samlUserObj = dataResponse;
      console.log(this.samlUserObj);
      if (this.samlUserObj != null) {
        //this.parsedPass = this.samlUserObj.FirstName + this.samlUserObj.LastName + this.samlUserObj.mlsName;
        //this.parsedUser = this.samlUserObj.mlsName + '-' + this.samlUserObj.loginid;
        this.loginUser();
        //this.validateClearedXML();
      } else {
        //var api = this.apiEndpoint;
        //window.location.href = api + "passport/ssoAuth";
      }
    },error=>{
      console.log(error);
      var api = this.apiEndpoint;
      console.log(api);
      
      if(this.mlsname == 'myrealtordash'){
        window.location.href = api + "passport/ssoAuthBeach";
      }else{
        window.location.href = api + "passport/ssoAuth";
      }

      //window.location.href = api + "passport/ssoAuth";
    });

    
  };

  loginUser() {
    console.log("Logging In Start");
    //return;
    console.log(this.savedUser);
    console.log(this.samlUserObj.data.email);
    
    this.loader = true;
    if (this.savedUser != null && (this.savedUser.email === this.samlUserObj.data.email)) {
      // Already Logged In
      console.log("Already");
      if (localStorage.getItem('queryListingid') != null) {
        if (!this.savedUser.eula_Check) {
          localStorage.removeItem('ClareityCheck');
          this.router.navigate(['/eula']);
        } else {
          localStorage.removeItem('ClareityCheck');
          this.router.navigate(['/paragonSubmit']);
        }
      } else {
        if (!this.savedUser.eula_Check) {
          localStorage.removeItem('ClareityCheck');
          this.router.navigate(['/eula']);
        } else {
          localStorage.removeItem('ClareityCheck');
          this.router.navigate(['/']);
        }
      }
    } else if (this.savedUser != null && (this.savedUser.email != this.samlUserObj.data.email)) {
      // Logged in as someone else
      console.log("Signout");
      this.signoutSaml();
    } else {
      console.log('in2');
      console.log(localStorage.getItem('queryAgentemail'));
      console.log(this.samlUserObj.data.email);
      
      //console.log(localStorage.getItem('queryAgentemail').toLowerCase() === this.samlUserObj.data.email.toLowerCase());
      
      // Relogging In
      if (localStorage.getItem('queryAgentemail') != null && localStorage.getItem('queryAgentemail').toLowerCase() === this.samlUserObj.data.email.toLowerCase()) {
        console.log("Matched Login");

        //console.log("Success!")
        this.samlFlag = 'true';

        const response = this.samlUserObj;
        this.loader = false;
        console.log(response.data.is_Agree);
        
        //if (!response.data.is_Agree) {
          /* const body = {
            'is_Agree': true,
            '_id': response.data._id
          };
          this.api.agree(body).subscribe((dataResponse) => { */
            //console.log(dataResponse);
            if (!response.data.eula_Check) {
              localStorage.setItem('currentUser', JSON.stringify(response.data));
              localStorage.setItem('userResponseToken', (response.token));
  
              localStorage.setItem('samlFlag', this.samlFlag);
              this.router.navigate(['/eula']);
            } else {
              //console.log("Dashboard Send");
              localStorage.setItem('samlFlag', this.samlFlag);
              this.gotoDashboard(response, this.samlUserObj);
            }
          //});
        //} else {
          

        //}
        /* const body = {
          'email': localStorage.getItem('queryAgentemail'),
          'password': this.parsedPass,
        };
        this.api.login(body).subscribe((dataResponse) => {
          //console.log("Success!")
          this.samlFlag = 'true';

          const response = dataResponse;
          this.loader = false;
          if (!response.data.is_Agree) {
            const body = {
              'is_Agree': true,
              '_id': response.data._id
            };
            this.api.agree(body).subscribe((dataResponse) => {
              //console.log(dataResponse);
            });
          } else {
            if (!response.data.eula_Check) {
              localStorage.setItem('currentUser', JSON.stringify(response.data));
              localStorage.setItem('userResponseToken', (response.token));

              localStorage.setItem('samlFlag', this.samlFlag);
              this.router.navigate(['/eula']);
            } else {
              //console.log("Dashboard Send");
              localStorage.setItem('samlFlag', this.samlFlag);
              this.gotoDashboard(response, dataResponse);
            }

          }
        },
          error => {
            this.loader = false;
            this.showMsgError = true;
            console.log(error.message);
            if (error.message === 'Email and password combination not found. Please try again.') {
              //console.log("Signing Up New User");
              this.signUpUser();
            } else {
              console.log("Error - " + error.message.message);
              //this.errormsg = error.message.message;
              localStorage.setItem('samlFlag', 'false');
              this.router.navigate(['/login']);
            }
          }); */
      } else if (localStorage.getItem('ClareityCheck') === "true") {
        console.log("Clareity");

        //console.log("Success!")
        this.samlFlag = 'true';

        const response = this.samlUserObj;
        //console.log(response);
        //console.log(response.data.is_Agree);
        
        this.loader = false;
        //if (!response.data.is_Agree) {
          /* const body = {
            'is_Agree': true,
            '_id': response.data._id
          };
          this.api.agree(body).subscribe((dataResponse) => { */
            //console.log(dataResponse);
            if (!response.data.eula_Check) {
              console.log("NOt Dashboard Send");
              localStorage.setItem('currentUser', JSON.stringify(response.data));
              localStorage.setItem('userResponseToken', (response.token));
              localStorage.setItem('samlFlag', this.samlFlag);
              this.router.navigate(['/eula']);
            } else {
              console.log("Dashboard Send");
              localStorage.setItem('samlFlag', this.samlFlag);
              this.gotoDashboard(response, this.samlUserObj);
            }
          //});
        //} else {
          
        //}
        /* const body = {
          'email': this.samlUserObj.Email,
          'password': this.parsedPass,
        };
        this.api.login(body).subscribe((dataResponse) => {
          //console.log("Success!")
          this.samlFlag = 'true';

          const response = dataResponse;
          this.loader = false;
          if (!response.data.is_Agree) {
            const body = {
              'is_Agree': true,
              '_id': response.data._id
            };
            this.api.agree(body).subscribe((dataResponse) => {
              //console.log(dataResponse);
            });
          } else {
            if (!response.data.eula_Check) {
              localStorage.setItem('currentUser', JSON.stringify(response.data));
              localStorage.setItem('userResponseToken', (response.token));

              localStorage.setItem('samlFlag', this.samlFlag);
              this.router.navigate(['/eula']);
            } else {
              //console.log("Dashboard Send");
              localStorage.setItem('samlFlag', this.samlFlag);
              this.gotoDashboard(response, dataResponse);
            }

          }


        },
          error => {
            this.loader = false;
            this.showMsgError = true;
            console.log(error.message);
            if (error.message === 'Email and password combination not found. Please try again.') {
              //console.log("Signing Up New User");
              this.signUpUser();
            } else {
              console.log("Error - " + error.message.message);
              //this.errormsg = error.message.message;
              localStorage.setItem('samlFlag', 'false');
              this.router.navigate(['/login']);
            }
          }); */
      } else {
        console.log('not match');
        
        var api = this.apiEndpoint;
        if(this.mlsname == 'myrealtordash'){
          window.location.href = api + "passport/ssoAuthBeach";
        }else{
          window.location.href = api + "passport/ssoAuth";
        }
      }
    }

  }

  gotoDashboard(response, dataResponse) {

    console.log('gotoDashboard');
    
    this.showMsgSuccess = true;
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    localStorage.setItem('userResponseToken', (response.token));

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
        //console.log(dataResponse.data.default_mls_frontend);
        if (dataResponse.data.default_mls_frontend) {
          localStorage.setItem('f_mls', dataResponse.data.default_mls_frontend);
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
        this.router.navigate(['/paragonSubmit']);
      } else {
        localStorage.removeItem('ClareityCheck');
        this.router.navigate(['/admin/dashboard']);
      }
    }
    else {
      this.intercomService.boot();
      if (localStorage.getItem('queryListingid') != null) {
        localStorage.removeItem('ClareityCheck');
        this.router.navigate(['/paragonSubmit']);
      } else {
        localStorage.removeItem('ClareityCheck');
        this.router.navigate(['/']);
      }

    }

  }

  signUpUser() {
    //console.log("Signup Start");

    this.submitted = true;

    this.showMsgSuccess = false;
    this.showMsgError = false;

    const body = {
      'username': this.parsedUser,
      'email': this.samlUserObj.Email,
      'password': this.parsedPass,
      'firstname': this.samlUserObj.FirstName,
      'lastname': this.samlUserObj.LastName,
      'companyname': this.samlUserObj.mlsName
    };

    this.api.signup(body).subscribe((dataResponse) => {

      this.samlFlag = 'true';

      const response = dataResponse;
      // console.log(response);
      // this.showMsgSuccess = true;

      localStorage.setItem('currentUser', JSON.stringify(response.data));
      localStorage.setItem('userResponseToken', (response.token));

      const token = response.token;
      localStorage.setItem('token', 'Bearer ' + token);
      const decoded = jwt_decode(token);
      const exp = decoded.exp;
      const date = new Date(exp * 1000);
      let i = 0;

      dataResponse.data.roles.forEach((item) => {
        //console.log("Role Call")
        if (item.role == 'mlsadmin') {
          if (dataResponse.data.default_mls_admin) {
            localStorage.setItem('mls', dataResponse.data.default_mls_admin);
          } else {
            if (item.association.length > 0) {
              localStorage.setItem('mls', item.association[0].mls_id);
            }
          }
          i++;
        }

        if (item.role == 'member') {
          //console.log("Member");
          if (dataResponse.data.default_mls_frontend) {
            localStorage.setItem('f_mls', dataResponse.data.default_mls_frontend);
          } else {
            if (item.association.length > 0) {
              localStorage.setItem('f_mls', item.association[0].mls_id);
            }
          }
        }
      });

      if (i > 0) {
        this.router.navigate(['/admin/dashboard']);
      } else {

        if (this.samlUserObj.mlsName === "IMLS") {
          //IMLS Body
          const body = {
            'mls_id': '5d846e8de3b0d50d6ac91a2d',
            'firstname': this.samlUserObj.FirstName,
            'lastname': this.samlUserObj.LastName,
            'email': this.samlUserObj.Email,
            'expiry': null,
            'wantsto': null,
            'wantstonotify': null,
            'market_center': 'Clareity ' + this.samlUserObj.Email,
            'payer_type_online': 'Offline'
          };
          this.dashApi.add_mls_user(body).subscribe((dataResponse) => {
            //await dataResponse;
            localStorage.setItem('samlFlag', this.samlFlag);
            this.loader = false;
            this.intercomService.boot();
            if (localStorage.getItem('queryListingid') != null) {
              if (!response.data.eula_Check) {
                this.router.navigate(['/eula']);
              } else {
                this.router.navigate(['/paragonSubmit']);
              }
            } else {
              if (!response.data.eula_Check) {
                this.router.navigate(['/eula']);
              } else {
                this.router.navigate(['/']);
              }
            }
          },
            (error) => {
              this.showMsgError = true;
              console.log(error);
              //this.errormsg = error.message;
              localStorage.setItem('samlFlag', 'false');
              this.loader = false;
              this.router.navigate(['/signup']);
            });
        } else {
          // Beaches Body
          const body = {
            'mls_id': '5d846e8de3b0d50d6ac919ec',
            'firstname': this.samlUserObj.FirstName,
            'lastname': this.samlUserObj.LastName,
            'email': this.samlUserObj.Email,
            'expiry': null,
            'wantsto': null,
            'wantstonotify': null,
            'market_center': 'Clareity ' + this.samlUserObj.Email,
            'payer_type_online': 'Offline'
          };
          this.dashApi.add_mls_user(body).subscribe((dataResponse) => {
            //await dataResponse;
            localStorage.setItem('samlFlag', this.samlFlag);
            this.loader = false;
            this.intercomService.boot();
            if (localStorage.getItem('queryListingid') != null) {
              if (!response.data.eula_Check) {
                this.router.navigate(['/eula']);
              } else {
                this.router.navigate(['/paragonSubmit']);
              }
            } else {
              if (!response.data.eula_Check) {
                this.router.navigate(['/eula']);
              } else {
                this.router.navigate(['/']);
              }
            }
          },
            (error) => {
              this.showMsgError = true;
              console.log(error);
              //this.errormsg = error.message;
              localStorage.setItem('samlFlag', 'false');
              this.loader = false;
              this.router.navigate(['/signup']);
            });
        }
      }

    },
      error => {
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
        localStorage.setItem('samlFlag', 'false');
        this.loader = false;
        this.router.navigate(['/signup']);
      }
    );

  }

  signoutSaml() {
    console.log("Clear LS")
    this.loginFlag = false;
    if (localStorage.getItem('queryListingid') != null) {
      localStorage.removeItem('currentUser');
      if (localStorage.getItem('samlFlag') === 'true') {
        //console.log('Saml Active')
        localStorage.setItem('samlFlag', 'false');
      } else {
        localStorage.removeItem('samlFlag');
      }
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
      localStorage.setItem('ClareityCheck', 'false');
    } else {
      localStorage.clear();
      localStorage.setItem('ClareityCheck', 'true');
    }
    this.savedUser = null;
    this.intercomService.boot();
    this.loginUser();
  }

  /*validateClearedXML() {
    this.http.get<any>(this.apiEndpoint + 'passport/xmlClear').subscribe((data) => {
      console.log("XML CLEARED");
      console.log(data.data);
      this.ssoValid = data.data;
      if (this.ssoValid === null) {
        console.log("Proceed");
        this.loginUser();
      } else {
        this.validateClearedXML();
        console.log("Rerun");
      }
    });
  }*/

}
