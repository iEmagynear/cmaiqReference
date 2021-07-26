import { Component, OnInit, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChartService } from "../../../services/chart.service";
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-client',
  templateUrl: './dialog-client.component.html',
  styleUrls: ['./dialog-client.component.scss']
})
export class DialogClientComponent implements OnInit {

  public innerHeight;
  addClient: any;
  phonemask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  loader = false;
  successmsg;
  submitted = false;
  //data;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private api: ChartService,
    public dialogRef: MatDialogRef<DialogClientComponent>,
    public dialog: MatDialog) {
    this.data = data;
  }

  ngOnInit() {
    this.validateClientForm();
  }

  validateClientForm() {

    this.addClient = this.formBuilder.group({

      email: ['', [Validators.maxLength(255), Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      phone: ['', [Validators.minLength(6), Validators.maxLength(30)]],
      fname: ['', [Validators.maxLength(80), Validators.required]],
      lname: ['', [Validators.maxLength(80), Validators.required]],

    });
  }
  showMessageFromChild(message: any) {
    //console.log(message);

    // this.translate.get('Property.AddProperty.Select client').subscribe( (text: string) => {
    //   console.log(text);
    //   this.groupName = text;
    // this.CreditCardConfirmation = text;
    // console.log(text);
    // });
  }
  addClientSub() {
    this.submitted = true;
    this.showMsgSuccess = false;
    this.showMsgError = false;

    if (this.addClient.invalid) {
      return;
    }
    this.loader = true;
    const body = {
      'email': this.addClient.value.email,
      'phone': this.addClient.value.phone,
      'firstname': this.addClient.value.fname,
      'lastname': this.addClient.value.lname,
      'mls_id': localStorage.getItem('f_mls')
    };

    this.api.addClient(body).subscribe((dataResponse) => {
      const response = dataResponse;
      //console.log(response);
      this.showMsgSuccess = true;
      this.successmsg = response.message
      this.addClient.reset({
        'email': '',
        'phone': '',
        'fname': '',
        'lname': '',
      });
      this.loader = false;
      this.submitted = false;
      if(this.dialogRef){
        this.dialogRef.close(response);
      }
      
    },
      error => {
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      });

  }

}
