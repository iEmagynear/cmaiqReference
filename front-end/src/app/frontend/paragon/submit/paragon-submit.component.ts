import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPropertyComponent } from '../../new-chart/dialog-property/dialog-property.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartService } from 'src/app/services/chart.service';
import { StatusService } from "../../../services/status.service";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-paragon-submit',
  templateUrl: './paragon-submit.component.html',
  styleUrls: ['./paragon-submit.component.scss'],
  providers: [StatusService]
})
export class ParagonSubmitComponent implements OnInit {

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

    this.getProperties();
    this.validateChartForm();

    this.route.params.subscribe((params) => {
      //console.log('params', params);
    });

    this.route.params.subscribe(res => {
      this.Id = res.id;
    });

    this.route.queryParams.subscribe((params) => {
      //console.log(params);
      this.params = {
        listingkey: localStorage.getItem('queryListingid'),
        mlsid: localStorage.getItem('queryMlsid')
      };

      /*this.params = {
        listingkey: '98744945,98760239,98729688,98741337,98752452,98758456,98754629,98736565,98752064,98754251,98745721,98748674',
        mlsid: 'IMLS'
      };*/

      if (this.params.listingkey != null) {
        this.parsedListingKey = this.params.listingkey.replace(/,/g, ", ");
      } else {
        this.parsedListingKey = 'No MLS Numbers Found'
      }

      if (this.params.mlsid === "IMLS") {
        localStorage.setItem('f_mls', '5d846e8de3b0d50d6ac91a2d');
      } else {
        localStorage.setItem('f_mls', '5d846e8de3b0d50d6ac919ec');
      }

      //console.log(this.params.listingkey);
      //console.log(this.params.mlsid);
      //console.log(this.parsedListingKey);

      this.getProperties();
      this.validateChartForm();
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
    console.log(label);
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
    console.log(label._id);
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
    var statusService = this.statusService;
    var active = this.homes.filter(function(el) {
      //console.log("Getting Actives");
      el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
      return el.StandardStatus === 'Active';
    });
    var closed = this.homes.filter(function(el) {
      //console.log("Getting Closeds");
      el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
      return el.StandardStatus === 'Closed';
    });
    var contingent = this.homes.filter(function(el) {
      //console.log("Getting Pendings");
      el.StandardStatus = statusService.get_standardstatus(el.StandardStatus);
      return (el.StandardStatus === 'Pending');
    });

    this.hasSeven = closed.length < 7 ? false : true;
    this.tooBig = closed.length > 100 ? true : false;
    console.log(this.hasSeven);
    console.log(this.tooBig);

    if (this.hasSeven === false) {
      Swal.fire({
        title: 'Minimum Closed Properties Requirement',
        text: 'There are too few closed properties in this set of comps. A minimum of 7 Closed properties is required to achieve the most accurate result. Please return to the MLS and modify your search so that at least 7 Closed properties are selected in the set of comps for the analysis.',
        width: '42em'
      });
      this.loader = false;
    } else if (this.tooBig === true) {
      Swal.fire({
        title: 'Maximum Closed Properties Requirement',
        text: 'There are too many closed properties in this set of comps. A maximum of 100 Closed properties is required to achieve the most accurate result. Please return to the MLS and modify your search so that at most 100 Closed properties are selected in the set of comps for the analysis.',
        width: '42em'
      });
      this.loader = false;
    } else {

      this.total_count = this.homes.length;
      this.active_count = active.length;
      this.pending_count = contingent.length;
      this.cancel_count = closed.length;


      var formdata = [];
      formdata['agent'] = '';//agent id
      formdata['id'] = this.Id;//client id
      formdata['client'] = this.client_id;//client id
      formdata['targetProperty'] = this.property_id;//property id
      formdata['sqr_ft'] = this.paragon.value.sqr_ft;//property id
      formdata['chart_title'] = this.paragon.value.chart_title;
      formdata['relatedProperty'] = this.saveBody;//current form data
      //console.log("Related Property: " + formdata['relatedProperty']);
      var inQueue = [];
      var self = this;
      var mls_key = this.mls_name;

      this.homes.forEach(function(el) {
        //console.log(el.StandardStatus);
        var photoUrlArr = [];


        if (el.listing) {
          if (el.listing.photos.length > 0) {
            el.listing.photos.forEach(function(pic) {
              photoUrlArr.push(pic.url)
            })
          }
        }

        if (el.LivingArea != '0' || el.LivingArea != null || el.LivingArea > 1) {
          if (el.StreetNumber === null || el.StreetName === null || el.City === null || el.ListPrice === null ||
            el.ListingId === null || el.PostalCode === null || el.StandardStatus === null) {
            console.log("error " + el.StandardStatus);
          } else {
            var parsedDaysOnMarket = null;
            if (el.StandardStatus === 'Active' && el.OnMarketDate != null) {
              // Perform Math for Active Properties
              //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
              var currentDate = new Date();
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.OnMarketDate);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              console.log("IMLS Active Days: " + diffDays);
              parsedDaysOnMarket = diffDays;
            } else if (el.StandardStatus === 'Pending' && el.OnMarketDate != null) {
              // Perform Math for Active Properties
              //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
              var currentDate = new Date();
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.OnMarketDate);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              console.log("IMLS Pending Days: " + diffDays);
              parsedDaysOnMarket = diffDays;
            } else if (el.StandardStatus === 'Closed' && el.OnMarketDate != null && el.CloseDate != null) {
              // Perform Math for Active Properties
              //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
              var currentDate = new Date(el.CloseDate);
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.OnMarketDate);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              console.log("IMLS Closed Days: " + diffDays);
              parsedDaysOnMarket = diffDays;
            } else {
              console.log("Zeroed DOM")
              parsedDaysOnMarket = "-";
            }

            if (parsedDaysOnMarket < 0) {
              //console.log("Found Negative Days for " + el.ListingId + ": " + parsedDaysOnMarket);
              parsedDaysOnMarket = Math.abs(parsedDaysOnMarket);
            } else {
              //console.log("Carry On")
            }

            //LPXDOM Calculation
            var parsedDaysOnMarketPriceChange = null;
            /*if (el.StandardStatus === 'Closed' && el.PriceChangeTimestamp != null && el.CloseDate != null) {
              // Perform Math for Closed Properties
              //console.log("LPXDOM Set-Up IMLS C Listing ID: " + el.ListingId)
              var closedDate = new Date(el.CloseDate);
              //console.log("A: " + closedDate);
              var entryDate = new Date(el.PriceChangeTimestamp);
              //console.log("B: " + entryDate);
              var timeDiff = closedDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              console.log("IMLS Closed DOMx: " + diffDays);
              parsedDaysOnMarketPriceChange = diffDays;
            } else if (el.StandardStatus === 'Pending' && el.PriceChangeTimestamp != null && el.StatusChangeTimestamp != null) {
              // Perform Math for Active Properties
              //console.log("LPXDOM Set-Up IMLS P Listing ID: " + el.ListingId)
              var currentDate = new Date(el.StatusChangeTimestamp);
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.PriceChangeTimestamp);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              console.log("IMLS Pending DOMx: " + diffDays);
              parsedDaysOnMarketPriceChange = diffDays;
            } else if (el.StandardStatus === 'Active' && el.PriceChangeTimestamp != null) {
              // Perform Math for Active Properties
              //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
              var currentDate = new Date();
              //console.log("AAA: " + currentDate);
              var entryDate = new Date(el.PriceChangeTimestamp);
              //console.log("BBB: " + entryDate);
              var timeDiff = currentDate.getTime() - entryDate.getTime();
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              console.log("IMLS Active DOMx: " + diffDays);
              parsedDaysOnMarketPriceChange = diffDays;
            } else {
              parsedDaysOnMarketPriceChange = "-";
            }*/
            parsedDaysOnMarketPriceChange = "-";

            /*if (parsedDaysOnMarketPriceChange != "-" && parsedDaysOnMarket < parsedDaysOnMarketPriceChange) {
              console.log("Correcting DOM")
              if (el.StandardStatus === 'Closed' && el.OnMarketDate != null) {
                // Perform Math for Closed Properties
                //console.log("Listing ID: " + el.ListingId)
                var closedDate = new Date(el.CloseDate);
                //console.log("A: " + closedDate);
                var entryDate = new Date(el.OnMarketDate);
                //console.log("B: " + entryDate);
                var timeDiff = closedDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                console.log("Closed Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.StandardStatus === 'Pending' && el.OnMarketDate != null) {
                // Perform Math for Pending Properties
                //console.log("Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AA: " + currentDate);
                var entryDate = new Date(el.OnMarketDate);
                //console.log("BB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                console.log("Pending Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else if (el.StandardStatus === 'Active' && el.OnMarketDate != null) {
                // Perform Math for Active Properties
                //console.log("Listing ID: " + el.ListingId)
                var currentDate = new Date();
                //console.log("AAA: " + currentDate);
                var entryDate = new Date(el.OnMarketDate);
                //console.log("BBB: " + entryDate);
                var timeDiff = currentDate.getTime() - entryDate.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                console.log("Active Days: " + diffDays);
                parsedDaysOnMarket = diffDays;
              } else {
                console.log ("Data not Accessible - Missing OnMarketDate");
              }
            } else {
              console.log("DOM is already Validated");
            }*/

            // Outlier Negative LPXDOM
            if (parsedDaysOnMarketPriceChange < 0 || parsedDaysOnMarketPriceChange > parsedDaysOnMarket) {
              //console.log("Dashed Negative")
              parsedDaysOnMarketPriceChange = parsedDaysOnMarket;
            } else {
              //console.log("Continue")
            }

            var parsedYearBuilt = (el.YearBuilt != null) ? el.YearBuilt : "-";
            var parsedListPrice = null
            var parsedClosedPrice = null
            var parsedSquareFootage = null;
            var parsedPrice = null;

            parsedListPrice = el.ListPrice ? parseInt(el.ListPrice) : "-";
            parsedClosedPrice = el.ClosePrice ? parseInt(el.ClosePrice) : "-";
            parsedSquareFootage = parseInt(el.LivingArea);
            parsedPrice = parseInt((el.StandardStatus === 'Closed') ? el.ClosePrice : el.ListPrice);

            var parsedPricePerSqFt = self.getPricePerSqFt(parsedPrice, parsedSquareFootage);
            var parsedSalesPriceToListPrice = self.getSalesPriceToListPrice(parsedClosedPrice, parsedListPrice);
            var parsedBathrooms;

            parsedBathrooms = el.BathroomsTotalInteger;
            //console.log("Got Value - " + parsedBathrooms);
            if (parsedBathrooms === null) {
              parsedBathrooms = "-";
              //console.log("Null Value")
            } else {
              console.log("Anomoly");
            }

            var parsedUnitNumber = "";
            if (el.UnitNumber != null) {
              parsedUnitNumber = "#" + el.UnitNumber;
            } else {
              //console.log("Null");
            }

            //console.log(parsedBathrooms);

            var parsedBedrooms;

            parsedBedrooms = el.BedroomsTotal ? parseInt(el.BedroomsTotal) : "-";

            inQueue.push({
              mlsNumber: el.ListingId,
              address: el.StreetNumber + " " + el.StreetName + " " + parsedUnitNumber,
              city: el.City,
              state: el.StateOrProvince,
              zip: el.PostalCode,
              lat: el.Latitude,
              long: el.Longitude,
              yearBuilt: parsedYearBuilt,
              bed: parsedBedrooms,
              bath: parsedBathrooms,
              days: parsedDaysOnMarket,
              daysPx: parsedDaysOnMarketPriceChange,
              status: el.StandardStatus,
              squareFootage: parsedSquareFootage,
              price: parsedPrice,
              closePrice: parsedClosedPrice,
              listPrice: parsedListPrice,
              saleDate: (el.StandardStatus === 'Closed') ? el.CloseDate : null,
              priceSqFt: parsedPricePerSqFt,
              salesToList: parsedSalesPriceToListPrice,
              photos: photoUrlArr,
            });
          }
        }

      });

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
        } else {
          //console.log("Pulling Status of Closed Home " + i + " : " + relatedHomes[i].status)
          formdata['closedHomes'].push(inQueue[i]);
          formdata['relatedHomes'].push(inQueue[i]);
        }
      }

      formdata['marketConditions'] = [];
      formdata['marketConditions']['compListingsTotal'] = this.total_count;
      formdata['marketConditions']['compActiveListings'] = this.active_count;
      formdata['marketConditions']['compSoldListings'] = this.cancel_count;
      formdata['marketConditions']['compPendingListings'] = this.pending_count > 0 ? this.pending_count : 1;

      // Sends an established Date Range
      //console.log(new Date(),new Date(formdata['relatedProperty']['min_date']))
      formdata['marketConditions']['dateRange'] = Math.ceil(Math.abs(<any>new Date() - <any>new Date(formdata['relatedProperty']['min_date'])) / 86400000);

      // Set Map Data for Chart-Detail
      formdata['mapDetailCenter'] = [];
      this.loader = true;
      var body = {
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
      //console.log(body);

      this.api.addChartResponse(body).subscribe((dataResponse) => {

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
      'property_type': this.addChart.property_type,
      'waterfront': this.addChart.waterfront,
      'private_pool': this.addChart.private_pool,
      'hopa': this.addChart.hopa,
      'hoa': this.addChart.hoa,
      'folionumber': this.addChart.folionumber,
      'min_year': this.addChart.min_year,
      'max_year': this.addChart.max_year,
      'min_price': this.addChart.min_price,
      'max_price': this.addChart.max_price,
      'min_square_footage': this.addChart.min_square_footage,
      'max_square_footage': this.addChart.max_square_footage,
      'min_date': this.minimumDate,
      'max_date': this.maximumDate,
      'property_id': this.property_id,
      'sub_divisions': this.subDivisions,
      'zip_code': this.zipCode,
      'furnished': this.addChart.furnished,
      'params': this.params,
      'isSSO':true
    };

    //console.log(body);

    this.api.addChart(body).subscribe((dataResponse) => {
      this.loader = true;
      this.saveBody = body;
      const response = dataResponse;
      //console.log("Going...")
      //console.log(response);
      if (response.error) {
        this.loader = false;
        console.log("ERROR!")
        return false;
      }
      var payload = response.value;
      if (payload.length > 0) {
        console.log("Setting Payload");
        this.homes = payload;
        console.log(this.homes);
        this.generateChart();
      } else {
        console.log("Nothing")
        this.loader = false;
      }

    },
      error => {
        this.loader = false;
      });
  }


  get f() { return this.paragon.controls; }

  validateChartForm() {
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
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogPropertyComponent, {
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


}
