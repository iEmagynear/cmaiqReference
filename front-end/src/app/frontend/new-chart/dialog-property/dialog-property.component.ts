import { CropperOption } from 'ngx-cropper';
import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChartService } from "../../../services/chart.service";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogClientComponent } from './../dialog-client/dialog-client.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dialog-property',
  templateUrl: './dialog-property.component.html',
  styleUrls: ['./dialog-property.component.scss'],
  providers: [ChartService]
})
export class DialogPropertyComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  public innerHeight;
  public cropperConfig: CropperOption;
  public listItem;
  public optionSelected;
  public selectedImg;
  public groupName = 'Select client';
  public btnlabel = [{ address: '537 Long Point Road, Suite 203, Mount Pleasant, SC 29464', thumbnail: 'assets/images/incity1.jpg' },
  { address: '537 Long Point Road, Suite 203, Mount Pleasant, SC 29464', thumbnail: 'assets/images/incity2.jpg' },
  { address: 'GKM', thumbnail: 'assets/images/incity3.jpg' },
  { address: 'RAV', thumbnail: 'assets/images/incity4.jpg' }];
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  loader = false;
  successmsg;
  addProperty;
  states;
  saveBody;
  clients;
  submitted = false;
  //client_id;
  select_client;
  Recommendation: string;
  Replace_image: string;

  @ViewChild('inputFile')
  inputFile: ElementRef;

  constructor(public translate: TranslateService, private formBuilder: FormBuilder,
    private api: ChartService,
    public dialog: MatDialog) {

  }

  ngOnInit() {
    this.getStates();
    this.getClients();
    this.validateClientForm();
    //this.mlsNumberImage();

    /* this.translate.get('Property.AddProperty.SelectClient/AddClient').subscribe( (text: string) => {
      console.log(text);
    }); */

  }

  mlsNumberImage(event){
    var inputValue = event.target.value;
    var prefilledImage = this.addProperty.value.property_image;
    //console.log(inputValue1);
    this.translate.get('Sign Out.Recommendation').subscribe((text: string) => {
      this.Recommendation = text;
    });
    this.translate.get('Sign Out.Replace_image').subscribe((text: string) => {
      this.Replace_image = text;
    });
    console.log(localStorage);
    this.loader = true;
    const body = {
      'access_token': localStorage.getItem('access_token'),
      'isOutAPC': true,
      'listingid': inputValue,
      'mlsid': 'IMLS',
      'mls_id': localStorage.getItem('f_mls'),
      'isSSO': false
    };
    if(inputValue.length == 8 || inputValue.length == 9){
    this.api.findMlsImage(body).subscribe((dataResponse) => {

      this.saveBody = body;
      const response = dataResponse;
      var image = '';
      if(response.value[0]){
        if(response.value[0].listing){
          image = response.value[0].listing.photos[0].fileurl;
        }else if(response.value[0].Media){
          image = response.value[0].Media[0].MediaURL;
        }
      }
    if(prefilledImage){
      Swal.fire({
        title: this.Recommendation,
        html: '<h6>' + this.Replace_image + '</h6>',
        //type: 'info',
        width: '42em',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Proceed',
      }).then((result) => {
        if (result.value) {
          if(response.value[0]){
            this.addProperty.controls.property_image.setValue(image);
            this.croppedImage = image;
          }else{
            this.addProperty.controls.property_image.setValue('');
            this.croppedImage = '';
          }
        }
      });
    }else{
      if(response.value[0]){
        this.addProperty.controls.property_image.setValue(image);
        this.croppedImage = image;
      }else{
        this.addProperty.controls.property_image.setValue('');
        this.croppedImage = '';
      }
    }

      // this.addProperty.controls.property_image.setValue(this.base64);
      this.loader = false;
    },
      error => {
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      });
    }else{
      this.loader = false;
    }
  }

  getStates() {

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

  // getClients(){

  //   this.loader = true;
  //   //console.log(localStorage.getItem('f_mls'));
  //   //if(localStorage.getItem('f_mls') != 'undefined'){
  //     this.api.getClientList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
  //       const response = dataResponse;
  //       this.clients = response;
  //       //console.log(response);
  //       this.loader = false;
  //     },
  //     error => {
  //      this.loader = false;
  //       this.showMsgError = true;
  //       console.log(error);
  //       this.errormsg = error.message;
  //     });
  //   //}

  // }
  getClients(newresponse = null) {
    //console.log(newresponse);

    this.loader = true;
    //console.log(localStorage.getItem('f_mls'));
    //if(localStorage.getItem('f_mls') != 'undefined'){
    this.api.getClientList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
      const response = dataResponse;
      this.clients = response;
      if (newresponse) {
        //console.log(newresponse);
        this.addProperty.controls.client.setValue(newresponse.saved_client._id);
        this.groupName = newresponse.saved_client.firstname + " " + newresponse.saved_client.lastname;
      }

      //console.log(response);
      this.loader = false;
    },
      error => {
        this.loader = false;
        console.log(error);
      });
  }

  selectClient(client) {
    //console.log(client);
    //this.client_id = client._id;
    this.addProperty.controls.client.setValue(client._id);
    this.groupName = client.firstname+" "+client.lastname+", "+client.email+", "+client.phone;

  }

  validateClientForm() {

    this.addProperty = this.formBuilder.group({

      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(5), Validators.maxLength(5), Validators.required]],
      square_footage: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5), Validators.required]],
      property_image: [''],
      client: [''],
      mls_number: [''],
      property_type: ['', [Validators.required]],
      bedroom: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(1), Validators.required]],
      bathroom: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.required]]
    });
  }

  addPropertySub() {

    this.submitted = true;
    //console.log(this.addProperty.controls.square_footage.errors);
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
      'mls_id': localStorage.getItem('f_mls'),
      'mls_number': this.addProperty.value.mls_number,
      'property_type': this.addProperty.value.property_type,
      'bedroom': this.addProperty.value.bedroom,
      'bathroom': this.addProperty.value.bathroom,
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
      //this.groupName = 'Select client';
      this.translate.get('Property.AddProperty.Select client').subscribe((text: string) => {
        //console.log(text);
        this.groupName = text;
        //this.CreditCardConfirmation = text;
        //console.log(text);
      });
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

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('Property.AddProperty.Select client').subscribe((text: string) => {
      console.log(text);
      this.groupName = text;
      //this.CreditCardConfirmation = text;
      //console.log(text);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogClientComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'property'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //if (result) {
      this.getClients(result);
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

  clearClient() {
    this.addProperty.controls.client.setValue("");
    //this.groupName = "Select client";
    this.translate.get('Property.AddProperty.Select client').subscribe((text: string) => {
      console.log(text);
      this.groupName = text;
      //this.CreditCardConfirmation = text;
      //console.log(text);
    });
  }


}
