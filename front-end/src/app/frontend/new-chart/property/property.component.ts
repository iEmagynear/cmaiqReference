import { CropperOption } from 'ngx-cropper';
import { Component, OnInit,HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChartService } from "../../../services/chart.service";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogClientComponent } from './../dialog-client/dialog-client.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  providers:[ChartService]

})
export class PropertyComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  public innerHeight;
  public cropperConfig: CropperOption;
  public listItem;
  public optionSelected;
  public selectedImg;
  public groupName = 'Select client';
  public btnlabel = [{address: '537 Long Point Road, Suite 203, Mount Pleasant, SC 29464',thumbnail: 'assets/images/incity1.jpg'},
  {address: '537 Long Point Road, Suite 203, Mount Pleasant, SC 29464',thumbnail: 'assets/images/incity2.jpg'},
  {address: 'GKM',thumbnail: 'assets/images/incity3.jpg'},
  {address: 'RAV',thumbnail: 'assets/images/incity4.jpg'}];
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  loader = false;
  successmsg;
  addProperty;
  states;
  clients;
  submitted = false;
  //client_id;
  select_client;

  @ViewChild('inputFile')
  inputFile: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private api:ChartService,
    public dialog: MatDialog) {

  }

  ngOnInit() {
    this.getStates();
    this.getClients();
    this.validateClientForm();
  }

  getStates(){

    this.loader = true;
    this.api.getStateList().subscribe((dataResponse) => {
      const response = dataResponse;
      this.states = response;
      //console.log(response);
      this.loader = false;
    },
    error => {
     this.loader = false;
      this.showMsgError = true;
      console.log(error);
      this.errormsg = error.message;
    });

  }

  getClients(){

    this.loader = true;
    /* this.api.getClientList().subscribe((dataResponse) => {
      const response = dataResponse;
      this.clients = response;
      //console.log(response);
      this.loader = false;
    },
    error => {
     this.loader = false;
      this.showMsgError = true;
      console.log(error);
      this.errormsg = error.message;
    }); */

  }

  selectClient(client){
    //console.log(client);
    //this.client_id = client._id; 
    this.addProperty.controls.client.setValue(client._id);
    this.groupName = client.firstname+" "+client.lastname+", "+client.email+", "+client.phone;

  }

  validateClientForm(){

    this.addProperty =  this.formBuilder.group({

      address: ['', [Validators.required]],
      city: ['', [ Validators.required]],
      state: ['', [ Validators.required]],
      zip: ['', [ Validators.pattern("^[0-9]*$"),Validators.minLength(5),Validators.maxLength(5),Validators.required]],
      square_footage:['',[Validators.pattern("^[0-9]*$"),Validators.minLength(3),Validators.maxLength(5),Validators.required]],
      property_image:[''],
      client:['']
    });
  }

  addPropertySub(){

    this.submitted = true;
    console.log(this.addProperty.controls.square_footage.errors);
    this.showMsgSuccess = false;
    this.showMsgError = false;
    if (this.addProperty.invalid) {
      return;
    }

    this.loader = true;

    const body = {
      'address': this.addProperty.value.address,
      'city': this.addProperty.value.city,
      'state': this.addProperty.value.state,
      'zip': this.addProperty.value.zip,
      'square_footage': this.addProperty.value.square_footage,
      'client': this.addProperty.value.client,
      'property_image': this.addProperty.value.property_image,
    };

    this.api.addProperty(body).subscribe((dataResponse) => {
        const response = dataResponse;
        //console.log(response);
        this.showMsgSuccess = true;
        this.successmsg = response.message
        this.addProperty.reset();
        this.imageChangedEvent = null;
        this.inputFile.nativeElement.value = null;
        this.croppedImage = '';
        this.loader = false;
        this.submitted = false;
        this.groupName = 'Select client';
        //this.client_id =
        //this.dialogRef.close(response);
      },
      error => {
       this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      });
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogClientComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action:'property'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //if (result) {
        this.getClients();
        //this.dialogRef.close(result);
      //}
    });
  }

  /* onReturnData($event){
    console.log($event);
  } */

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //console.log(this.croppedImage);
    this.addProperty.controls.property_image.setValue(this.croppedImage);
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

  ngOnDestroy()
  {

    //console.log("destroy");
    //this.dialog.closeAll();
    if(this.dialog)
    {
      //this.opportunityInfoSub.unsubscribe();
      this.dialog.closeAll();
    }

  }

}
