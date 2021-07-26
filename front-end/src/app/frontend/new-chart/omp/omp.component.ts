import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { StatusService } from 'src/app/services/status.service';
import { OmpPropertiesUploadComponent } from './../../omp-properties-upload/omp-properties-upload.component';
import { SharedMlsService } from "../../../services/shared-mls.service";

@Component({
  selector: 'app-omp',
  templateUrl: './omp.component.html',
  styleUrls: ['./omp.component.scss']
})
export class OmpComponent implements OnInit {

  selectedAll = false;
  genChartButtonError = true;
  genChartButtonErrorNew = true;
  ompForm: FormGroup;
  closedOmpCount = 0;
  searchPropertiesdata: any;
  maxclosedlimit = 0;
  @Input() offMarketHomes: any;
  //@Input() searchPropertiesdata: any;
  //@Output() countChanged: EventEmitter<number> =   new EventEmitter();
  @Output() ompformdata: EventEmitter<any> =   new EventEmitter();
  @Output() ompformdataCount: EventEmitter<any> =   new EventEmitter();
  //@Output() singleOmp: EventEmitter<any> =   new EventEmitter();
  constructor( private sharedMlsService: SharedMlsService,public statusService: StatusService,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    ) {

      this.sharedMlsService.dataString$.subscribe(
        data => {
          //this.searchPropertiesdata = data;
          //console.log(data);
          this.gotSearchData(data);
        });
    }

  ngOnInit() {
    
    this.createForm();
    //console.log(this.searchPropertiesdata);
    
  }

  gotSearchData(data){
    this.searchPropertiesdata = data;
    //console.log(this.searchPropertiesdata.closedHomes);
    this.maxclosedlimit = 100 - this.searchPropertiesdata.closedHomes.length;
    this.check7ClosedOmp();
  }

  createForm()  {

    this.ompForm  = this._fb.group({
      omp: this._fb.array([]),
    });

    //console.log(this.ompForm);
    if(this.offMarketHomes.length > 0){
      this.offMarketHomes.forEach(element => {
        //console.log(element);
        const control = <FormArray>this.ompForm.controls['omp'];
        control.push(this.createOmpAutoGet(element));
      });
      this.check7ClosedOmp();
    }

  }

  selectAll() {
    
    //console.log(this.selectedAll);
    
    const control = <FormArray>this.ompForm.controls['omp'];
    for (var i = 0; i < control.controls.length; i++) {
      //console.log(control.controls[i]['controls'].selected.value);
      control.controls[i]['controls'].selected.setValue((this.selectedAll)?false:true);
      //this.names[i].selected = this.selectedAll;
      
    }
    (this.selectedAll)?this.selectedAll = false:this.selectedAll =true;
    //console.log(this.selectedAll);
    
    //this.checkmastercheckbox = !(this.selectedAll);
  }

  deleteAllSelected(){
    var control = <FormArray>this.ompForm.controls['omp'];
    let selectedCOunt = 0;
    //if (confirm("Are you sure you want to delete this OMPs?")) {
    for(var i=control.controls.length;i-->0;){
        //myControls.removeAt(i);
        if(control.controls[i]['controls'].selected.value){
          //this.deleteOmp(i);
          selectedCOunt++
        }
      }
    
    //this.checkmastercheckbox = false;
      //this.selectedAll  = false;
    //}

    if(selectedCOunt){
        if (confirm("Are you sure you want to delete this OMPs?")) {
          for(var i=control.controls.length;i-->0;){
            //myControls.removeAt(i);
            if(control.controls[i]['controls'].selected.value){
              this.deleteOmp(i);
              //selectedCOunt++
            }
          }
        
          //this.checkmastercheckbox = false;
          this.selectedAll  = false;
      }
    }
    
  }

  addOmp(): void {
    const control = <FormArray>this.ompForm.controls['omp'];
    control.push(this.createOmp());
  }

  deleteOmpOne(i: number) {
    if (confirm("Are you sure you want to delete this OMP?")) {
    const control = <FormArray>this.ompForm.controls['omp'];
    control.removeAt(i);
    this.check7ClosedOmp();
    }
  }

  deleteOmp(i: number) {
    const control = <FormArray>this.ompForm.controls['omp'];
    control.removeAt(i);
    this.check7ClosedOmp();
  }

  createOmp() {
    //console.log('in');
    
    return this._fb.group({
      address: ['', [Validators.required]],
      sold_price: ['',[Validators.pattern(/^\d+$/)]],
      sold_date: [''],
      sqft: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5), Validators.required]],
      status: ['', [Validators.required]],
      year_built: ['', [Validators.pattern(/^\d+$/),Validators.required]],
      bedroom: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.required]],
      bathroom: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.required]],
      listing_price: ['', [Validators.pattern(/^\d+$/),Validators.required]],
      latitude: ['',[Validators.required,Validators.pattern(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/)]],
      longitude: ['',[Validators.required,Validators.pattern(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/)]],
      photos:[''],
      selected:[false],
      state: ['', [Validators.required]],
      zip: ['', [Validators.pattern("^[0-9]*$"),Validators.minLength(5),Validators.maxLength(5),Validators.required]],
      city: ['', [Validators.required]],
      days: ['', [Validators.pattern(/^\d+$/),Validators.required]]
      /* picture:[''] */
    });
  }

  createOmpAuto(element) {
    //console.log('in');
    element['status'] = this.statusService.get_standardstatus(element.Status);
    //console.log(element);
    /* if(element['status'] == 'Closed'){
      this.closedOmpCount++;
    } */
    
    return this._fb.group({
      address: [element["Street #"]+' '+element["Street Name"], [Validators.required]],
      sold_price: [element["Sold Price"]?element["Sold Price"]:'',[Validators.pattern(/^\d+$/)]],
      sold_date: [element["Sold Date"]?element["Sold Date"]:null],
      sqft: [element["SqFt - Living"], [Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5),Validators.required]],
      status: [element["status"], [Validators.required]],
      year_built: [element["Year Built"], [Validators.pattern(/^\d+$/),Validators.required]],
      bedroom: [element["Total Bedrooms"], [Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.required]],
      bathroom: [element["Baths - Total"], [Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.required]],
      listing_price: [element["List Price"], [Validators.pattern(/^\d+$/),Validators.required]],
      latitude: [element["Geo Lat"],[Validators.required,Validators.pattern(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/)]],
      longitude: [element["Geo Lon"],[Validators.required,Validators.pattern(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/)]],
      photos:[element['Photo URL']],
      state: [element["State/Province"], [Validators.required]],
      zip: [element["Zip Code"],[Validators.pattern("^[0-9]*$"),Validators.minLength(5),Validators.maxLength(5),Validators.required]],
      city: [element["City"], [Validators.required]],
      days: [element["Days on Market"], [Validators.required]],
      selected:[false],
    });
  }

  createOmpAutoGet(element) {
    
    return this._fb.group({
      address: [element["address"], [Validators.required]],
      sold_price: [element["closePrice"],[Validators.pattern(/^\d+$/)]],
      sold_date: [(element["saleDate"])?new Date(element["saleDate"]):null],
      sqft: [element["squareFootage"], [Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5),Validators.required]],
      status: [element["status"], [Validators.required]],
      year_built: [element["yearBuilt"], [Validators.pattern(/^\d+$/),Validators.required]],
      bedroom: [element["bed"], [Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.required]],
      bathroom: [element["bath"], [Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.required]],
      listing_price: [element["price"], [Validators.pattern(/^\d+$/),Validators.required]],
      latitude: [element["lat"],[Validators.required,Validators.pattern(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/)]],
      longitude: [element["long"],[Validators.required,Validators.pattern(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/)]],
      photos:[element["photos"]],
      state: [element["state"], [Validators.required]],
      zip: [element["zip"], [Validators.pattern("^[0-9]*$"),Validators.minLength(5),Validators.maxLength(5),Validators.required]],
      city: [element["city"], [Validators.required]],
      days: [element["days"], [Validators.required]],
      selected:[false],
    });
  }

  onStatusChange(){
    this.check7ClosedOmp();
  }

  check7ClosedOmp(){
    this.closedOmpCount = 0;
    //console.log(this.ompForm.controls.omp.value);
    this.ompForm.controls.omp.value.forEach(element => {
      if(element.status == 'Closed'){
        this.closedOmpCount++;
      }
    });
    
    //console.log(this.closedOmpCount);
    //console.log(this.maxclosedlimit);
    //console.log(this.closedOmpCount < 7 || this.closedOmpCount > 100 );
    //console.log(this.maxclosedlimit > 0 && this.closedOmpCount > this.maxclosedlimit);
    
    if((this.closedOmpCount < 7 || this.closedOmpCount > 100 )){
      this.genChartButtonError = true;
    }
    else{
      this.genChartButtonError = false;
    }

    if(this.searchPropertiesdata){
      var totalClosedCount = 0;
      totalClosedCount = this.closedOmpCount + this.searchPropertiesdata.closedHomes.length;
      if((this.maxclosedlimit > 0 && this.closedOmpCount > this.maxclosedlimit) || totalClosedCount < 7 || totalClosedCount > 100){
        this.genChartButtonErrorNew = true;
      }
      else{
        this.genChartButtonErrorNew = false;
      }
    }
    
  }

  onSubmit(){
    //console.log(this.ompForm.controls.omp.value);
    //this.dialogRef.close(this.ompForm.controls.omp.value);
    //this.countChanged.emit(1);
    var body = {
      'formdata':this.ompForm.controls.omp.value,
      'countChanged':1,
      'singleOmp':true
    };

    this.ompformdata.emit(body);
    //this.singleOmp.emit(true);
  }

  generate_chart_with_searchdata(){
    //console.log('yes');
    //this.countChanged.emit(1);
    var body = {
      'formdata':this.ompForm.controls.omp.value,
      'countChanged':1,
      'singleOmp':false
    };
    //console.log(body);
    
    this.ompformdata.emit(body);
    //this.singleOmp.emit(false);
  }

  openFloating() {
    const dialogRef = this.dialog.open(OmpPropertiesUploadComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'Floating'
      },
      width: '45em'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //console.log(result.jsondata);
        result.jsondata.forEach(element => {
          //console.log(element);
          const control = <FormArray>this.ompForm.controls['omp'];
          control.push(this.createOmpAuto(element));
        });

        this.check7ClosedOmp();
        //this.router.navigate(['/property-import-submit/' + result]);
        //this.getReviewersList();
      }
    });
  }

  hideMe(){
    let body = {
      'countChanged':1,
      length:this.ompForm.controls.omp.value.length
    }
    //this.countChanged.emit(1);
    this.ompformdataCount.emit(body);
  }
  

}
