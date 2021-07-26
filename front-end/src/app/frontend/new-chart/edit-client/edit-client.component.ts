import { Component, OnInit,HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChartService } from "../../../services/chart.service";
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss'],
  providers:[ChartService,
    { provide: MatDialogRef }
  ]
})
export class EditClientComponent implements OnInit {

  public innerHeight;
  addClient:any;
  phonemask: any[] = [ '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  loader = false;
  successmsg;
  data;
  currentId;

  constructor(private formBuilder: FormBuilder,
    private api:ChartService,
    @Optional() @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<EditClientComponent>,
    public dialog: MatDialog,public route: ActivatedRoute) {
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

  ngOnInit() {

    this.route.params.subscribe(res => {
      this.currentId = res.id;
      //console.log(this.currentId);
      this.getClient(this.currentId);
      /* this.validateAddMlsUserForm(this.currentId);
      this.getClient(this.currentId); */

    });

    this.validateClientForm();
  }



  validateClientForm(){

    this.addClient =  this.formBuilder.group({

      email: ['', [ Validators.maxLength(255),Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      phone: ['', [ Validators.minLength(6),Validators.maxLength(30)]],
      fname: ['', [ Validators.maxLength(80),Validators.required]],
      lname: ['', [ Validators.maxLength(80),Validators.required]],
      id: ['', [ Validators.required]],

    });
  }

  getClient(id){
    this.loader = true;
    this.api.get_client(id).subscribe(
    (dataResponse) => {
      //console.log(dataResponse);
      this.addClient.controls.email.setValue(dataResponse.data.email);
      this.addClient.controls.phone.setValue(dataResponse.data.phone);
      this.addClient.controls.fname.setValue(dataResponse.data.firstname);
      this.addClient.controls.lname.setValue(dataResponse.data.lastname);
      this.addClient.controls.id.setValue(dataResponse.data._id);
      this.loader = false;
    },
    (error) => {
      console.log(error);
      this.loader = false;
    });
  }

  addClientSub(){

    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.loader = true;

    const body = {
      'id': this.addClient.value.id,
      'email': this.addClient.value.email,
      'phone': this.addClient.value.phone,
      'firstname': this.addClient.value.fname,
      'lastname': this.addClient.value.lname,
    };
    console.log(body);

    this.api.editClient(body).subscribe((dataResponse) => {
        const response = dataResponse;
        console.log(response);
        this.showMsgSuccess = true;
        this.successmsg = response.message
        /* this.addClient.reset({
          'email': '',
          'phone': '',
          'fname': '',
          'lname': '',
        }); */
        this.loader = false;
        //this.dialogRef.close(response);
      },
      error => {
       this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      });

  }

}
