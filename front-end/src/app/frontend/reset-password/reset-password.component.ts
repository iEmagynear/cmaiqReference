import { Component, OnInit,HostListener } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { UserService } from "../../services/user.service";
import * as jwt_decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  showMsgSuccess = false;
  successmsg;
  showMsgError = false;
  errormsg;
  resetPassword:any;
  public innerHeight;
  token;
  loader = false;
  constructor(private formBuilder: FormBuilder,
    public api: UserService,private router:Router,private route: ActivatedRoute,) {
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
    this.token = this.route.snapshot.queryParams['token'];
  }

  validateLoginForm(){

    this.resetPassword =  this.formBuilder.group({

      newpassword: ['', [ Validators.required,Validators.minLength(6),Validators.maxLength(30)]],
      confirmpassword: ['', [ Validators.required,Validators.minLength(6),Validators.maxLength(30)]]

    });
  }

  resetPasswordSub(){
    this.loader = true;
    this.showMsgSuccess = false;
    this.showMsgError = false;

    console.log(this.resetPassword.value);

    const body = {

      'newpassword': this.resetPassword.value.newpassword,
      'confirmpassword': this.resetPassword.value.confirmpassword,
      'token':this.token
    };

    this.api.resetPasswordApi(body).subscribe((dataResponse) => {

        const response = dataResponse;
        //console.log(response);
        this.showMsgSuccess = true;
        this.successmsg = response.message;
        this.resetPassword.reset({
          'email': ''
        });

        setTimeout(eve => {
          this.router.navigate(['/login']);
        }, 2000);

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

}
