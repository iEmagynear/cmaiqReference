import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPropertyComponent } from '../new-chart/dialog-property/dialog-property.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartService } from 'src/app/services/chart.service';
import { StatusService } from "../../services/status.service";
import Swal from 'sweetalert2';
import { DialogPropertyPopupComponent } from '../new-chart/dialog-property-popup/dialog-property-popup.component';
@Component({
  selector: 'app-property-import-submit',
  templateUrl: './property-import-submit.component.html',
  styleUrls: ['./property-import-submit.component.scss']
})
export class PropertyImportSubmitComponent implements OnInit {

  public paragon;
  public mlsName = 'Select';
  public chartType = 'Residential';
  public subDivisions = [];
  public zipCode = [];
  public minimumDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  public maximumDate = new Date();
  public chartList = [{ id: 1, name: 'Residential' }, { id: 2, name: ' Rental' }];
  public paragonProperty = [
    { name: 'Paragon 1' },
    { name: 'Paragon 2' },
    { name: 'Paragon 3' },
    { name: 'Paragon 4' }
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
  Id;
  mls_name = "Intermountain MLS";
  parsedListingKey;
  total_count = 0;
  active_count = 0;
  pending_count = 0;
  cancel_count = 0;
  saveBody;
  params;
  homes;
  tooBig;
  hasSeven;
  addChart;
  dataRes;
  genChartButtonError = false;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private api: ChartService,
    public statusService: StatusService,
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

    /* this.getProperties();
    this.validateChartForm(); */

    /* this.route.params.subscribe((params) => {
      //console.log('params', params);
    }); */

    this.route.params.subscribe(res => {
      this.Id = res.id;
      //console.log(this.Id);
      this.getTempData();
    });

    this.route.queryParams.subscribe((params) => {
      //console.log(params);
      /* this.params = {
        listingkey: localStorage.getItem('queryListingid'),
        mlsid: localStorage.getItem('queryMlsid')
      }; */

      /*this.params = {
        listingkey: '98744945,98760239,98729688,98741337,98752452,98758456,98754629,98736565,98752064,98754251,98745721,98748674',
        mlsid: 'IMLS'
      };*/

      /* if (this.params.listingkey != null) {
        this.parsedListingKey = this.params.listingkey.replace(/,/g, ", ");
      } else {
        this.parsedListingKey = 'No MLS Numbers Found'
      }

      if (this.params.mlsid === "IMLS") {
        localStorage.setItem('f_mls', '5d846e8de3b0d50d6ac91a2d');
      } else {
        localStorage.setItem('f_mls', '5d846e8de3b0d50d6ac919ec');
      } */

      //console.log(this.params.listingkey);
      //console.log(this.params.mlsid);
      //console.log(this.parsedListingKey);

      this.getProperties();
      //this.validateChartForm();
      this.validateParagonForm();

      localStorage.removeItem('queryListingid');
      localStorage.removeItem('queryMlsid');
      localStorage.removeItem('queryAgentemail');
      localStorage.removeItem('queryOfficename');
      localStorage.removeItem('queryAgentphone');

      //localStorage.getItem('queryAgentemail');
      //localStorage.getItem('queryOfficename');
      //localStorage.getItem('queryAgentphone');
    });
  }

  getTempData(){

    this.api.getTempData(this.Id).subscribe((dataResponse) => {
      this.dataRes = dataResponse.jsondata;
      //console.log(dataResponse.jsondata);
      //this.properties = properties;
      this.loader = false;
    },
    error => {
      this.loader = false;
      //this.showMsgError = true;
      console.log(error);
      this.router.navigate(['/']);
      //this.errormsg = error.message;
    });

  }

  getProperties() {
    this.properties = [];
    var properties = [];
    this.loader = true;
    this.api.getPropertyList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
      //const response = dataResponse;
      console.log(dataResponse);
      dataResponse.forEach(function(el, idx) {
        //console.log(el);
        //self.mapMarkers[idx].setMap(null);
        properties.push({
          _id: el._id,
          address: el.address,
          city: el.city,
          client: el.client,
          created: el.created,
          mls_user_id: el.mls_user_id,
          property_image: (el.property_image) ? el.property_image : '../../../../assets/images/house-icon-large.png',
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
        //console.log(error);
        //this.errormsg = error.message;
      });

  }

  onGroup(label) {
    //console.log(label);
    this.property_id = label._id;
    this.client_id = label.client;
    this.mlsName = label.address;
    this.selectedImg = label.property_image;
    this.paragon.controls.mlsName.setValue(this.mlsName);
    this.showft = false;

    this.paragon.controls.chart_title.setValue('');
    this.paragon.controls.chart_title.setValidators(null);
    this.paragon.controls.chart_title.setErrors(null);
    this.paragon.controls.chart_title.updateValueAndValidity();

    this.paragon.controls.sqr_ft.setValue('');
    this.paragon.controls.sqr_ft.setValidators(null);
    this.paragon.controls.sqr_ft.setErrors(null);
    this.paragon.controls.sqr_ft.updateValueAndValidity();

    /* this.chartType = 'Select';
    this.paragon.controls.chartType.setValue('');
    this.paragon.controls.chartType.setValidators(null);
    this.paragon.controls.chartType.setErrors(null);
    this.paragon.controls.chartType.updateValueAndValidity(); */
    /* this.showft = false;
    this.paragon.controls.sqr_ft.setValue(''); */
    //console.log(label._id);
  }

  clearParagonPropert() {
    this.paragon.controls.sqr_ft.setValidators([Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5), Validators.required]);
    this.showft = true;
    this.mlsName = 'Select';
    //this.showft = true;
    this.property_id = '';
    this.client_id = '';
    //this.groupName = 'Select';
    this.selectedImg = '';
    this.paragon.controls.mlsName.setValue('');
    this.paragon.controls.sqr_ft.updateValueAndValidity();
  }

  validateParagonForm() {
    this.paragon = this.fb.group({
      mlsName: [''],
      chartType: [''],
      chart_title: ['', Validators.required],
      sqr_ft: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5), Validators.required]],
      built_year: ['', [Validators.pattern(/^\d+$/)]],
      bedrooms: [''],
      bathrooms: [''],
      type: [''],
      params: [this.params]
    });
  }

  generateChart() {

    var dataResponse = JSON.parse(this.dataRes);

    console.log(dataResponse);

    var statusService = this.statusService;

    // let _this = this;

    var active = dataResponse.filter(function(el) {
      el.StandardStatus = statusService.get_standardstatus(el['Status']);
      return (el.StandardStatus === 'Active');
    });

    var closed = dataResponse.filter(function(el) {
      el.StandardStatus = statusService.get_standardstatus(el['Status']);
      return (el.StandardStatus === 'Closed');
    });

    var contingent = dataResponse.filter(function(el) {
      el.StandardStatus = statusService.get_standardstatus(el['Status']);
      return (el.StandardStatus === 'Pending')
    });

    //console.log(closed.length);

    const hasSeven = closed.length < 7 ? false : true;
    const tooBig = closed.length > 100 ? true : false;
    //console.log(hasSeven);
    //console.log(tooBig);
    this.genChartButtonError = false;
    /* if (dataResponse.length > this.maxCount) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MaximumResultsExceeded,
        html: '<h6>' + this.MaximumResultsExceededtext + '<h6>',
        width: '42em'
      });
    } else if ((!hasSeven)) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MinimumResultsError,
        html: '<h6>' + this.MinimumResultsErrortext + '<h6>',
        width: '42em'
      });
    } else if ((tooBig)) {
      this.genChartButtonError = true;
      Swal.fire({
        title: this.MaximumResultsExceeded,
        html: '<h6>' + this.MaximumResultsExceededtext + '<h6>',
        width: '42em'
      });
    } */
    //console.log(this.genChartButtonError);
    this.loader = false;
    var inQueue = [];
    if(!this.genChartButtonError){
      this.loader = true;
      dataResponse.forEach(element => {
        //console.log(element);

        var parsedDaysOnMarketPriceChange = null;
        element['Status'] = this.statusService.get_standardstatus(element.Status);
        //console.log(element['Status']);

        if(element['Status']){
          //const el = element;
          if (element['Status'] === 'Closed' && element['Price Change Timestamp'] != null && element['Sold Date'] != null) {
            // Perform Math for Closed Properties
            //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
            //console.log(element['Sold Date']);
            var closedDate = new Date(element['Sold Date']);
            //console.log("A: " + closedDate);
            var entryDate = new Date( element['Price Change Timestamp']);
            //console.log("B: " + entryDate);
            var timeDiff = closedDate.getTime() - entryDate.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //console.log("Stellar Closed Days: " + diffDays);
            parsedDaysOnMarketPriceChange = diffDays;
          } else if (element['Status'] === 'Pending' && element['Price Change Timestamp'] != null && element['Status Change Date'] != null) {
            // Perform Math for Active Properties
            //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
            var currentDate = new Date(element['Status Change Date']);
            //console.log("AAA: " + currentDate);
            var entryDate = new Date(element['Price Change Timestamp']);
            //console.log("BBB: " + entryDate);
            var timeDiff = currentDate.getTime() - entryDate.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //console.log("Stellar Pending Days: " + diffDays);
            parsedDaysOnMarketPriceChange = diffDays;
          } else if (element['Status'] === 'Active' && element['Price Change Timestamp'] != null) {
            // Perform Math for Active Properties
            //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
            var currentDate = new Date();
            //console.log("AAA: " + currentDate);
            var entryDate = new Date(element['Price Change Timestamp']);
            //console.log("BBB: " + entryDate);
            var timeDiff = currentDate.getTime() - entryDate.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //console.log("Stellar Active Days: " + diffDays);
            parsedDaysOnMarketPriceChange = diffDays;
          } else {
            parsedDaysOnMarketPriceChange = "-";
          }

          inQueue.push({
            address: element["Street #"]+' '+element["Street Name"],
            bath: element["Baths - Total"],
            bed: element["Total Bedrooms"],
            city: element["City"],
            closePrice: element["Sold Price"]?element["Sold Price"]:'-',
            days: element["Days on Market"],
            daysPx: parsedDaysOnMarketPriceChange,
            lat: element["Geo Lat"],
            listPrice: element["List Price"],
            long: element["Geo Lon"],
            mlsNumber:  element["List Number"],
            photos: [element['Photo URL']],
            price: parseInt((element["Status"] === 'Closed') ? element["Sold Price"] : element["List Price"]),
            priceSqFt: element["List Price/SqFt"],
            saleDate: element["Sold Date"]?element["Sold Date"]:null,
            salesToList: (element["Sold Date"])?((element["Sold Price"] / element["List Price"]) * 100):null,
            squareFootage: element["SqFt - Living"],
            state: element["State/Province"],
            status: element["Status"],
            yearBuilt: element["Year Built"],
            zip: element["Zip Code"]
          });

        }
      });

      //console.log(inQueue);

      var formdata = [];

      formdata['agent'] = '';//agent id

      formdata['id'] = '';//client id

      formdata['client'] = this.client_id;//client id
      formdata['targetProperty'] = this.property_id;//property id
      formdata['sqr_ft'] = this.paragon.value.sqr_ft;//property id
      formdata['chart_title'] = this.paragon.value.chart_title;;
      formdata['relatedProperty'] = this.saveBody;//current form data

      formdata['relatedHomes'] = [];
      formdata['activeHomes'] = [];
      formdata['pendingHomes'] = [];
      formdata['closedHomes'] = [];
      formdata['offMarketHomes'] = [];

      for (var i = 0; i < inQueue.length; i++) {
        //console.log(inQueue[i].status);
        if (inQueue[i].status.toLowerCase() === "active") {
          //console.log("Pulling Status of Active Home " + i + " : " + relatedHomes[i].status)
          formdata['activeHomes'].push(inQueue[i]);
          formdata['relatedHomes'].push(inQueue[i]);
        } else if (inQueue[i].status.toLowerCase() === "pending") {
          //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
          formdata['pendingHomes'].push(inQueue[i]);
          formdata['relatedHomes'].push(inQueue[i]);
        } else if (inQueue[i].status.toLowerCase() === "active - coming soon") {
          //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
          formdata['activeHomes'].push(inQueue[i]);
          formdata['relatedHomes'].push(inQueue[i]);
        } else {
          //console.log("Pulling Status of Closed Home " + i + " : " + relatedHomes[i].status)
          formdata['closedHomes'].push(inQueue[i]);
          formdata['relatedHomes'].push(inQueue[i]);
        }
      }

      formdata['marketConditions'] = [];
      formdata['marketConditions']['compListingsTotal'] = dataResponse.length;
      formdata['marketConditions']['compActiveListings'] = active.length;
      formdata['marketConditions']['compSoldListings'] = closed.length;
      formdata['marketConditions']['compPendingListings'] = contingent.length > 0 ? contingent.length : 1;

      // Sends an established Date Range
      //console.log(new Date(),new Date(formdata['relatedProperty']['min_date']))
      formdata['marketConditions']['dateRange'] = Math.ceil(Math.abs(<any>new Date(new Date().setFullYear(new Date().getFullYear() - 1)) - <any>new Date()) / 86400000);

      // Set Map Data for Chart-Detail
      formdata['mapDetailCenter'] = [];
      formdata['mapDetailCenter']['lat'] = '';
      formdata['mapDetailCenter']['lng'] = '';
      formdata['mapDetailCenter']['zoom'] = '';
      var importbody = {
        'activeHomes': formdata['activeHomes'],
        'agent': formdata['agent'],
        'client': formdata['client'],
        'id': formdata['id'],
        'closedHomes': formdata['closedHomes'],
        'mapDetailCenter': {
          'lat': formdata['mapDetailCenter']['lat'],
          'lng': formdata['mapDetailCenter']['lng'],
          'zoom': formdata['mapDetailCenter']['zoom']
        },
        'marketConditions': {
          'compListingsTotal': formdata['marketConditions']['compListingsTotal'],
          'compActiveListings': formdata['marketConditions']['compActiveListings'],
          'compSoldListings': formdata['marketConditions']['compSoldListings'],
          'compPendingListings': formdata['marketConditions']['compPendingListings'],
          'dateRange': formdata['marketConditions']['dateRange']
        },
        'pendingHomes': formdata['pendingHomes'],
        'relatedHomes': formdata['relatedHomes'],
        'relatedProperty': formdata['relatedProperty'],
        'targetProperty': formdata['targetProperty'],
        'sqr_ft': formdata['sqr_ft'],
        'chart_title': formdata['chart_title']
      }

      //console.log(importbody);

      this.api.addChartResponse(importbody).subscribe((dataResponse) => {

        this.api.save_chart_db(dataResponse.data).subscribe((dataResponse1) => {
          localStorage.setItem('investFlag', 'true');
          this.router.navigate(['/chart/' + dataResponse1._id]);
        },
        (error) => {
          this.loader = false;
          console.log(error);
        });

      },
      (error) => {
        this.loader = false;
        console.log(error);
      });

      //this.loader = false;
      //fileUpload.clear();
    }
  }

  paragonSubmit() {
    //console.log("Submit Start");
    this.loader = true;
    const body = {
      'isOutAPC': true,
      'client_id': this.client_id,
      'chart_title': this.paragon.value.chart_title,
      'sqr_ft': this.paragon.value.sqr_ft,
      'mls_id': localStorage.getItem('f_mls'),
      'listing_type': this.chartType,
      'min_date': this.minimumDate,
      'max_date': this.maximumDate,
      'property_id': this.property_id,
      'params': this.params,
      'isSSO':true
    };
    this.saveBody = body;
    console.log(body);
    this.generateChart();

  }


  get f() { return this.paragon.controls; }

  /* validateChartForm() {
    this.addChart = {
      chart_title: '',
      groupName: '',
      property_type: '',
      waterfront: '',
      private_pool: '',
      hopa: '',
      hoa: '',
      folionumber: '',
      sqr_ft: '',
      min_year: '',
      max_year: '',
      min_price: '',
      max_price: '',
      min_square_footage: '',
      max_square_footage: '',
      listing_type: 'Residential',
      furnished: ''
    };
    console.log(this.addChart);
  } */

  openDialog() {
    const dialogRef = this.dialog.open(DialogPropertyPopupComponent, {
      panelClass: 'property-dialog-container',
      data: {
        action: 'property'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProperties();
      //console.log(result);
    });
  }

  toggleAsk() {
    this.showHideAsk = !this.showHideAsk;
    if (this.showHideAsk) {
      this.askOption = 'Less Options';
    } else {
      this.askOption = 'More Options';
    }
  }

  getPricePerSqFt(listPrice, squareFootage) {
    var result = listPrice / squareFootage;
    return result;
  }

  getSalesPriceToListPrice(closePrice, listPrice) {
    var result = (closePrice / listPrice) * 100;
    return result;
  }

  ngOnDestroy()
  {

    if(this.dialog)
    {
      //this.opportunityInfoSub.unsubscribe();
      this.dialog.closeAll();
    }

  }

}
