import { Component, OnInit,HostListener } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { UserService } from "../../services/user.service";
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  showMsgSuccess = false;
  successmsg;
  showMsgError = false;
  errormsg;
  forgotPassword:any;
  public innerHeight;
  loader = false;

  constructor(private formBuilder: FormBuilder,
    public api: UserService,private router:Router) {
      this.validateLoginForm();
      this.onResize();
  }

  @HostListener('window:resize')
   onResize() {
     if(screen.width < 767){
      this.innerHeight = (window.innerHeight) - 200 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
  }

  ngOnInit() {
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
        this.router.navigate(['/']);
      }
    }
  }

  validateLoginForm(){

    this.forgotPassword =  this.formBuilder.group({

      email: ['', [ Validators.maxLength(255),Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
  }

  forgotPasswordSub(){

    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.loader = true;
    console.log(this.forgotPassword.value);

    const body = {

      'email': this.forgotPassword.value.email
    };

    this.api.forgotPasswordApi(body).subscribe((dataResponse) => {

        const response = dataResponse;
        //console.log(response);
        this.showMsgSuccess = true;
        this.successmsg = response.message;
        this.forgotPassword.reset({
          'email': ''
        });
        this.loader = false;
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
