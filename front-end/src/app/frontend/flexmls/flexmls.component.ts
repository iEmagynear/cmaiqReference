import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPropertyComponent } from '../new-chart/dialog-property/dialog-property.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartService } from 'src/app/services/chart.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-flexmls',
  templateUrl: './flexmls.component.html',
  styleUrls: ['./flexmls.component.scss']
})
export class FlexmlsComponent implements OnInit {

  public flexMls;
  public mlsName = 'Select';
  public chartType = 'Select';
  public chartList = [{id: 1, name: 'Residential'}, {id: 2, name: ' Rental'}];
  public flexProperty = [
    {name: 'Flexmls 1'},
    {name: 'Flexmls 2'},
    {name: 'Flexmls 3'},
    {name: 'Flexmls 4'}
  ];
  loader = false;

  properties = [];
  public showft = true;
  public clearSelect = true;
  public askOption = 'More Options';
  public showHideAsk = false;
  public innerHeight;
  property_id: any;
  client_id: any;
  selectedImg: any;
  params;

  constructor(private fb:FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private api: ChartService,
    private router: Router) {
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

  ngOnInit() {
    //this.flexSubmit();
    this.getProperties();

    this.route.params.subscribe((params) => {

      //console.log('params', params);

    });

    this.route.queryParams.subscribe((params) => {

      console.log(params);
      this.params = params;
      this. validateFlexmlsForm();
    });
  }

  getProperties() {
    this.properties = [];
    var properties = [];
    this.loader = true;
    this.api.getPropertyList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
      //const response = dataResponse;
      //console.log(dataResponse);
      dataResponse.forEach(function (el, idx) {
        //console.log(el);
        //self.mapMarkers[idx].setMap(null);
        properties.push({
          _id: el._id,
          address: el.address,
          city: el.city,
          client: el.client,
          created: el.created,
          mls_user_id: el.mls_user_id,
          property_image: (el.property_image) ? el.property_image : '../../../assets/images/services1.png',
          square_footage: el.square_footage,
          state: el.state,
          updated: el.updated,
          zip: el.zip
        });
      });
      this.properties = properties;
      this.loader = false;
    },
    error => {
      this.loader = false;
      //this.showMsgError = true;
      console.log(error);
      //this.errormsg = error.message;
    });

  }

  onGroup(label){
    // console.log(label);
    this.property_id = label._id;
    this.client_id = label.client;
    this.mlsName = label.address;
    this.selectedImg = label.property_image;
    this.flexMls.controls.mlsName.setValue(this.mlsName);
    this.showft = false;

    this.flexMls.controls.chart_title.setValue('');
    this.flexMls.controls.chart_title.setValidators(null);
    this.flexMls.controls.chart_title.setErrors(null);
    this.flexMls.controls.chart_title.updateValueAndValidity();

    this.flexMls.controls.sqr_ft.setValue('');
    this.flexMls.controls.sqr_ft.setValidators(null);
    this.flexMls.controls.sqr_ft.setErrors(null);
    this.flexMls.controls.sqr_ft.updateValueAndValidity();

    /* this.chartType = 'Select';
    this.flexMls.controls.chartType.setValue('');
    this.flexMls.controls.chartType.setValidators(null);
    this.flexMls.controls.chartType.setErrors(null);
    this.flexMls.controls.chartType.updateValueAndValidity(); */
    /* this.showft = false;
    this.flexMls.controls.sqr_ft.setValue(''); */
    console.log(label._id);
  }

  onCategory(label){
    this.chartType = label.name;
    this.flexMls.controls.chartType.setValue(this.chartType);
    console.log(label.name);
  }

  clearFlexmlsPropert() {
    this.flexMls.controls.sqr_ft.setValidators([Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5), Validators.required]);
    this.showft = true;
    this.mlsName = 'Select';
    //this.showft = true;
    this.property_id = '';
    this.client_id = '';
    //this.groupName = 'Select';
    this.selectedImg = '';
    this.flexMls.controls.mlsName.setValue('');
    this.flexMls.controls.sqr_ft.updateValueAndValidity();
  }

  clearFlexmlsCat(){
    this.chartType = 'Select';
    this.flexMls.controls.chartType.setValue('');
  }

  validateFlexmlsForm(){
    this.flexMls = this.fb.group({
      mlsName: [''],
      chartType: ['',Validators.required],
      chart_title: ['',Validators.required],
      sqr_ft: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5), Validators.required]],
      built_year: ['', [Validators.pattern(/^\d+$/)]],
      //max_year: ['', [Validators.pattern(/^\d+$/)]],
      bedrooms: [''],
      bathrooms: [''],
      type: [''],
      params:[this.params]
    });
  }

  flexSubmit(){
    this.loader = true;
    const body = {
      //'access_token': localStorage.getItem('access_token'),
      //'api': localStorage.getItem('api'),
      'property_id': this.property_id,
      'client_id':this.client_id,
      'chart_title': this.flexMls.value.chart_title,
      //'chartType':this.flexMls.value.chartType,
      'property_type': this.flexMls.value.chartType,
      'sqr_ft': this.flexMls.value.sqr_ft,
      'built_year': this.flexMls.value.built_year,
      //'max_year': this.flexMls.value.max_year,
      'bedrooms': this.flexMls.value.bedrooms,
      'bathrooms': this.flexMls.value.bathrooms,
      'params': this.flexMls.value.params,
    };

    //console.log( body );
    //return false;

    this.api.addChartSpark(body).subscribe((dataResponse) => {
      var outlier = JSON.parse(dataResponse.response);
      var closehomes = dataResponse.data.closedHomes;

      var active_outliers = JSON.parse(outlier.active_outliers);
      var pending_outliers = JSON.parse(outlier.pending_outliers);
      var sold_outliers = JSON.parse(outlier.sold_outliers);

      var outlierText = '';
      if(active_outliers.length>0){
        active_outliers.forEach(element => {
          outlierText += element.address + ' ,';
        });
      }

      if(pending_outliers.length>0){
        pending_outliers.forEach(element => {
          outlierText += element.address + ' ,';
        });
      }

      if(sold_outliers.length>0){
        sold_outliers.forEach(element => {
          outlierText += element.address + ' ,';
        });
      }
      outlierText = outlierText.slice(0, -1);
      var remainsClose = closehomes.length - sold_outliers.length;
      if ((active_outliers.length > 0 || sold_outliers.length > 0 || sold_outliers.length > 0) && remainsClose >= 7)
      {

        Swal.fire({
          title: 'The following outliers have been removed to ensure statistical accuracy. They were eliminated because of a significant difference in price or square footage.',
          text: outlierText,
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok!',
          width: '42em'
        }).then((result) => {

          if (result.value) {
            //this.loader = true;
            //dataResponse.data.id = body.id;
            //console.log(dataResponse.data);
            this.api.save_chart_db(dataResponse.data).subscribe((dataResponse1) => {
              //console.log(dataResponse1);
              this.router.navigate(['/chart/' + dataResponse1._id]);
            },
            (error)=>{
              this.loader = false;
              console.log(error);
            });
          }
        });
      }

      if(sold_outliers.length > 0 && remainsClose < 7)
      {
        Swal.fire({
          //type: 'error',
          title: 'Too many outliers have been found and removed. There are not enough results to generate a chart. Please try your search again.',
          text: outlierText,
          width: '42em'
        });
        this.loader = false;
      }

      if(sold_outliers.length == 0)
      {
        //this.loader = true;
        this.api.save_chart_db(dataResponse.data).subscribe((dataResponse1) => {
          this.router.navigate(['/chart/' + dataResponse1._id]);
        },
        (error)=>{
          this.loader = false;
          console.log(error);
        });
      }

    },
    (error) => {
      this.loader = false;
      console.log(error);
      Swal.fire({
        //type: 'error',
        title: 'Create Chart Error',
        html: '<h6>There was an error creating the chart. This specific data search contains a data error. Please go to +New Chart to reenter the search criteria and try again. If you continue to have challenges creating your chart, please contact us via Intercom in the lower right corner of your screen or via email at info@apcdata.net.<h6>',
        width: '42em'
        //footer: '<a href>Why do I have this issue?</a>'
      });
    });

  }


  get f() { return this.flexMls.controls; }

  openDialog(){
    const dialogRef = this.dialog.open(DialogPropertyComponent, {
      panelClass: 'property-dialog-container',
      data: {
        action:'property'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProperties();
      //console.log(result);
    });
  }

  toggleAsk(){
    this.showHideAsk = !this.showHideAsk;
    if(this.showHideAsk) {
      this.askOption = 'Less Options';
    } else {
      this.askOption = 'More Options';
    }
  }


}
