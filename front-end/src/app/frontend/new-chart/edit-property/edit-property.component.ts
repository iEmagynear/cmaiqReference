import { Component, OnInit,HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChartService } from "../../../services/chart.service";
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogClientComponent } from './../dialog-client/dialog-client.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CropperOption } from 'ngx-cropper';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],
  providers:[ChartService]

})
export class EditPropertyComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  public innerHeight;
  public cropperConfig: CropperOption;
  public listItem;
  public optionSelected;
  public selectedImg;
  public groupName;// = 'Select client';
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
  currentId;
  Recommendation: string;
  Replace_image: string;
  saveBody;

  @ViewChild('inputFile')
  inputFile: ElementRef;

  constructor(public translate: TranslateService,private formBuilder: FormBuilder,
    private api:ChartService,
    public dialog: MatDialog,public route: ActivatedRoute) { }

  ngOnInit() {

    this.getStates();
    this.getClients();
    this.validateClientForm();

  }

  getProperty(id){

    this.loader = true;
    this.api.get_property(id).subscribe(
    (dataResponse) => {
      //console.log(dataResponse);

      this.addProperty.controls.address.setValue(dataResponse.data.address);
      this.addProperty.controls.city.setValue(dataResponse.data.city);
      this.addProperty.controls.state.setValue(dataResponse.data.state);
      this.addProperty.controls.zip.setValue(dataResponse.data.zip);
      this.addProperty.controls.id.setValue(dataResponse.data._id);
      this.addProperty.controls.square_footage.setValue(dataResponse.data.square_footage);
      this.addProperty.controls.property_image.setValue(dataResponse.data.property_image);
      //this.addProperty.controls.client.setValue(dataResponse.data.client);

      this.addProperty.controls.bathroom.setValue(dataResponse.data.bathroom);
      this.addProperty.controls.bedroom.setValue(dataResponse.data.bedroom);
      this.addProperty.controls.property_type.setValue(dataResponse.data.property_type);
      this.addProperty.controls.mls_number.setValue(dataResponse.data.mls_number);
      //console.log(this.clients);
      this.croppedImage = dataResponse.data.property_image;
      //console.log(dataResponse.data.client);

      for (var i = 0; i < this.clients.length; i++){
        if (this.clients[i]._id == dataResponse.data.client){
          var client = this.clients[i];
          //console.log(client);
          this.addProperty.controls.client.setValue(dataResponse.data.client);
          this.groupName = client.firstname+" "+client.lastname+", "+client.email+", "+client.phone;
        }
      }

      this.loader = false;
    },
    (error) => {
      console.log(error);
      this.loader = false;
    });

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
    this.api.getClientList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
      const response = dataResponse;
      this.clients = response;
      this.route.params.subscribe(res => {
        this.currentId = res.id;
        //console.log(this.currentId);
        this.getProperty(this.currentId);
        /* this.validateAddMlsUserForm(this.currentId);
        this.getClient(this.currentId); */

      });
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

  selectClient(client){
    //console.log(client);
    //this.client_id = client._id;
    this.addProperty.controls.client.setValue(client._id);
    this.groupName = client.firstname+" "+client.lastname+", "+client.email+", "+client.phone;

  }

  validateClientForm(){

    this.addProperty =  this.formBuilder.group({

      id: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [ Validators.required]],
      state: ['', [ Validators.required]],
      zip: ['', [ Validators.pattern("^[0-9]*$"),Validators.minLength(5),Validators.maxLength(5),Validators.required]],
      square_footage:['',[Validators.pattern("^[0-9]*$"),Validators.minLength(3),,Validators.maxLength(5),Validators.required]],
      property_image:[''],
      client:[''],
      mls_number: [''],
      property_type: ['', [Validators.required]],
      bedroom: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(1), Validators.required]],
      bathroom: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.required]]
    });
  }

  addPropertySub(){

    this.submitted = true;
    //console.log(this.addProperty.controls.square_footage.errors);
    this.showMsgSuccess = false;
    this.showMsgError = false;
    if (this.addProperty.invalid) {
      return;
    }

    this.loader = true;

    const body = {
      'id': this.addProperty.value.id,
      'address': this.addProperty.value.address,
      'city': this.addProperty.value.city,
      'state': this.addProperty.value.state,
      'zip': this.addProperty.value.zip,
      'square_footage': this.addProperty.value.square_footage,
      'client': this.addProperty.value.client,
      'property_image': this.addProperty.value.property_image,
      'mls_number': this.addProperty.value.mls_number,
      'property_type': this.addProperty.value.property_type,
      'bedroom': this.addProperty.value.bedroom,
      'bathroom': this.addProperty.value.bathroom,
    };

    this.api.editProperty(body).subscribe((dataResponse) => {
        const response = dataResponse;
        console.log(response);
        this.showMsgSuccess = true;
        this.successmsg = response.message
        this.loader = false;
        /* this.addProperty.reset();
        this.imageChangedEvent = null;
        this.inputFile.nativeElement.value = null;
        this.croppedImage = '';
        this.loader = false;
        this.submitted = false;
        this.groupName = 'Select client'; */
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

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('Property.AddProperty.Select client').subscribe( (text: string) => {
      console.log(text);
      this.groupName = text;
      //this.CreditCardConfirmation = text;
      //console.log(text);
    });
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

  clearClient(){
    this.addProperty.controls.client.setValue("");
    //this.groupName = "Select client";
    this.translate.get('Property.AddProperty.Select client').subscribe( (text: string) => {
      //console.log(text);
      this.groupName = text;
      //this.CreditCardConfirmation = text;
      //console.log(text);
    });
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
    //console.log(inputValue);
    this.loader = true;
    const body = {
      'access_token': localStorage.getItem('access_token'),
      'isOutAPC': true,
      'listingid': inputValue,
      'mlsid': 'IMLS',
      'mls_id': localStorage.getItem('f_mls'),
      'isSSO': false
    };
    if(inputValue.length == 8 || inputValue.length == 8){
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


}
