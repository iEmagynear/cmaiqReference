import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { DashboardService } from "../../services/dashboard.service";
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoCommaPipe } from './../../pipes/nocomma.pipe';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { DialogPropertyComponent } from '../../frontend/new-chart/dialog-property/dialog-property.component'
import { ConvertPipe } from './../../pipes/convert.pipe';
import { NewClientComponent } from 'src/app/frontend/new-chart/new-client/new-client.component';
import { ProspectingComponent } from 'src/app/frontend/new-chart/prospecting/prospecting.component';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  providers: [ChartService, DashboardService, NoCommaPipe, DecimalPipe,ConvertPipe]
})
export class AnalysisComponent implements OnInit {
  clients;
  TotalImprovementValuePer;
  showPortal = false;
  getinvestmentData;
  public innerHeight;
  confValues: any;
  loader = false;
  samlFlag = false;
  hasTypes: boolean = false;
  charts = [];
  public selectedAll;
  public showHideAddvance: boolean = false;
  lvalue: any = 'lvalue1';
  lvalue1: any;
  lvalue2: any;
  loanPlaceholder: string = '$';
  Id;
  localStorage;
  mls_name;
  maxInput;
  redirect = false;
  public flex;
  averagePropertyValue: any = 0;
  BuildingValuePer: any;
  propertyAdjustmentValue: any = 0;
  isExtraFields: any;
  hasRental: any;
  lvalueSm: any = 'lvalue1';
  loanPlaceholderSm: string;
  maxInputSm: any;
  rentalPropertyValue: number;

  constructor(private apiChart: ChartService,private converterpipe: ConvertPipe,private api: ChartService,
    private DashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private _decimalPipe: DecimalPipe,
    public translate: TranslateService,
    public dialog: MatDialog,
    private elRef: ElementRef) {
    if (localStorage.getItem('samlFlag') === 'true') {
      //console.log('SAML Login')
      this.samlFlag = true;
    } else {
      //console.log("No SAML");
      this.samlFlag = false;
    }

  }

  ngOnInit() {

    this.localStorage = JSON.parse(localStorage.getItem('investment-analysis'));

    this.validateDefaultValuesForm();
    this.get_charts();
    this.getDefaultValues();
    this.getMlsDetails();
    document.addEventListener("wheel", function() {
      (document.activeElement as HTMLElement).blur();
    })
  }

  checkRoutes() {
    this.route.params.subscribe(res => {

      this.Id = res.id;
      //this.redirect = res.redirect;

      //console.log(res);

      if (res.redirect == 'redirectBackToAnalysis') {
        this.redirect = true;
      }

      if (this.Id && this.Id != 'new-investment') {
        //console.log('in2');
        this.get_chart_details(this.Id);
      }

      if (this.Id == 'new-investment' && this.redirect == true) {
        //console.log('in1');
        this.fillFormWithOldData();
      }

      if (!this.Id && !this.localStorage) {
        this.router.navigate(['/investment-analysis/']);
      }
      //this.get_chart_details(this.currentId);
    });
  }

  validateDefaultValuesForm() {

    this.confValues = this.formBuilder.group({

      //_id:[currentId],
      checkpropertyfill: ['', [Validators.required]],
      checkrentalfill: ['', [Validators.required]],
      propertyValueResSelect: [''],
      propertyValueRes: [''],
      propertyValueRenSelect: [''],
      propertyValueRental: [''],
      //propertyValue: [''],
      Improvements: ['0'],
      TotalImprovementValue: ['0'],
      landValue: ['0'],
      BuildingValue: ['0'],
      //rental: [''],
      RateofInflation: [''],
      HouseValueAppreciation: [''],
      CostofSale: [''],
      EstimatedVacancy: [''],
      NominalFederalIncomeTaxRate: [''],
      NominalStateIncomeTaxRate: [''],
      NominalLocalIncomeTaxRate: [''],
      NominalStraightLineRecaptureTaxRate: [''],
      NominalFederalCapitalGainTaxRate: [''],
      NominalStateCapitalGainTaxRate: [''],
      NominalLocalCapitalGainTaxRate: [''],
      FmInterestRate: ['', [Validators.required]],
      FmTerm: ['', [Validators.required]],
      SmInterestRate: ['', [Validators.required]],
      SmTerm: ['', [Validators.required]],
      Repairs: [''],
      Electric: [''],
      Water: [''],
      Accounting: [''],
      Liscenses: [''],
      Advertising: [''],
      Trash: [''],
      monitoring: [''],
      maintenance: [''],
      Pest: [''],
      Management: [''],
      Other: [''],
      EstimatedClosingCosts: [''],
      DownpaymentorEquity: [''],
      loanvalue: ['0', [Validators.required]],
      rtaxes: ['', [Validators.required]],
      propertyInsurance: ['', [Validators.required]],
      hoa: [''],
      RegimeFee: [''],
      LoantoValue: ['$', [Validators.required]],
      advanced: ['0', [Validators.required]],
      LoantoValueSm: ['$', [Validators.required]],
      FmEstimatedClosingCosts: ['0', [Validators.required]],
      SmLoantoValueorLoanAmount: ['0', [Validators.required]],
      SmEstimatedClosingCosts: ['0', [Validators.required]]
      /* Downpayment: [''],
      yearofsale: [''],
      totalInitialInvestment: [''] */

    });

  }


  changeBuildingValue() {

    var BuildingValue = this.confValues.controls.BuildingValue.value;

    var landValueNew = parseInt(this.averagePropertyValue) - BuildingValue;

    this.confValues.controls.landValue.setValue(Math.round(landValueNew));

    this.calculatePropAdjValue();
  }

  changelandValue() {

    var landValue = this.confValues.controls.landValue.value;

    var BuildingValueNew = parseInt(this.averagePropertyValue) - landValue;

    this.confValues.controls.BuildingValue.setValue(Math.round(BuildingValueNew));

    this.calculatePropAdjValue();
  }

  onProChange(val) {

    this.averagePropertyValue = 0;
    if (val != '') {
      this.confValues.controls.checkpropertyfill.setValue(1);
      this.confValues.controls.propertyValueRes.setValue('');

      var body = {

        'investment': this.confValues.value,
      }

      console.log(body);

      this.loader = true;
      if (this.confValues.controls.propertyValueResSelect.value) {
        this.api.add_chart_response_investment_check(body).subscribe((dataResponse1) => {
          //console.log(dataResponse1);
          var plotResp = JSON.parse(dataResponse1.response);
          //console.log(plotResp.estimated_home_value.sales_price.lower_bound);
          //console.log(plotResp.estimated_home_value.sales_price.upper_bound);
          var averagePropertyValue = (plotResp.estimated_home_value.sales_price.lower_bound + plotResp.estimated_home_value.sales_price.upper_bound) / 2
          this.averagePropertyValue = averagePropertyValue;
          this.setTotalImpValue();
          this.calculateDownpaymentorEquity();
          this.loader = false;
        });
      }
    }
    else {
      this.confValues.controls.checkpropertyfill.setValue('');
    }

  }

  calculateDownpaymentorEquity() {

    var loanvalue = parseFloat(this.confValues.controls.loanvalue.value);
    var Smloanvalue = parseFloat(this.confValues.controls.SmLoantoValueorLoanAmount.value);
    var Improvements = parseFloat(this.confValues.controls.Improvements.value);

    var LoantoValue = (this.confValues.controls.LoantoValue.value);
    var LoantoValueSm = (this.confValues.controls.LoantoValueSm.value);

    if (!loanvalue) {
      loanvalue = 0
    }

    if (!Smloanvalue) {
      Smloanvalue = 0
    }

    if (LoantoValue == '%') {
      loanvalue = parseFloat(this.averagePropertyValue) * loanvalue / 100
    }

    if (LoantoValueSm == '%') {
      Smloanvalue = parseFloat(this.averagePropertyValue) * Smloanvalue / 100
    }

    var DownpaymentorEquity = Math.round(parseFloat(this.averagePropertyValue) + Improvements - loanvalue - Smloanvalue);
    //console.log(DownpaymentorEquity);
    this.confValues.controls.DownpaymentorEquity.setValue(DownpaymentorEquity);
  }

  onProIChange(val) {

    if (val != '') {
      this.averagePropertyValue = val;
      this.confValues.controls.checkpropertyfill.setValue(1);
      this.confValues.controls.propertyValueResSelect.setValue('');
      this.setTotalImpValue();
      this.calculateDownpaymentorEquity();
    }
    else {
      this.confValues.controls.checkpropertyfill.setValue('');
    }
  }

  setTotalImpValue() {

    //console.log(this.averagePropertyValue);

    var TotalImprovementValue = Math.round(parseInt(this.averagePropertyValue) * parseInt(this.TotalImprovementValuePer) / 100) + parseInt(this.confValues.controls.Improvements.value);
    if (isNaN(TotalImprovementValue)) {
      this.confValues.controls.TotalImprovementValue.setValue(0);
    }
    else {
      this.confValues.controls.TotalImprovementValue.setValue(TotalImprovementValue);
    }

    var landValue = parseInt(this.averagePropertyValue) + parseInt(this.confValues.controls.Improvements.value) - TotalImprovementValue;

    if (isNaN(landValue)) {
      this.confValues.controls.landValue.setValue(0);
    }
    else {
      this.confValues.controls.landValue.setValue(Math.round(landValue));
    }

    this.confValues.controls.BuildingValue.setValue(Math.round(parseInt(this.averagePropertyValue) * parseInt(this.BuildingValuePer) / 100));

    this.calculatePropAdjValue();
    this.calculateDownpaymentorEquity();
  }

  calculatePropAdjValue() {
    //console.log(this.confValues.value)

    let currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');

    //let newValue: string = currencyPipe.transform(total, 'USD', 'symbol', "1.0-2");

    var BuildingValue = this.confValues.controls.BuildingValue.value;
    var landValue = this.confValues.controls.landValue.value;
    var Improvements = this.confValues.controls.Improvements.value;
    var total = parseFloat(BuildingValue) + parseFloat(landValue) + parseFloat(Improvements);
    if (isNaN(total)) {
      this.propertyAdjustmentValue = '-';
    }
    else {
      this.propertyAdjustmentValue = currencyPipe.transform(total, 'USD', 'symbol', "1.0-2");
    }
  }

  onRenChange(val) {
    //console.log(val);
    if (val != '') {
      this.confValues.controls.checkrentalfill.setValue(1);
      this.confValues.controls.propertyValueRental.setValue('');
    }
    else {
      this.confValues.controls.checkrentalfill.setValue('');
    }

    this.loader = true;
    var body = {
        
      'investment': this.confValues.value,
    }

    this.api.add_chart_response_investment_check_rental(body).subscribe((dataResponse1) => {
      //console.log(dataResponse1);
      var plotResp = JSON.parse(dataResponse1.response);
      //console.log(plotResp.estimated_home_value.sales_price.lower_bound);
      //console.log(plotResp.estimated_home_value.sales_price.upper_bound);
      this.rentalPropertyValue = (plotResp.estimated_home_value.sales_price.lower_bound+plotResp.estimated_home_value.sales_price.upper_bound)/2
      //console.log((averagePropertyValue));
      this.loader = false;
    });

  }

  noComma(val) {
    if (val !== undefined && val !== null) {
      // here we just remove the commas from value
      return val.toString().replace(/,/g, "");
    } else {
      return "";
    }
  }

  onRenIChange(val) {
    //console.log(val);
    if (val != '') {
      this.confValues.controls.checkrentalfill.setValue(1);
      this.confValues.controls.propertyValueRenSelect.setValue('');
    }
    else {
      this.confValues.controls.checkrentalfill.setValue('');
    }
  }

  getDefaultValues() {
    this.loader = true;
    this.DashboardService.get_default_values().subscribe((dataResponse) => {

      if (dataResponse.defaultValues) {
        this.confValues.patchValue(
          dataResponse.defaultValues
        );
        //console.log(dataResponse.defaultValues);
        this.confValues.controls.TotalImprovementValue.setValue(0);
        this.confValues.controls.BuildingValue.setValue(0);
        this.confValues.controls.hoa.setValue(dataResponse.defaultValues.Hoa);

        this.TotalImprovementValuePer = dataResponse.defaultValues.TotalImprovementValue;
        this.BuildingValuePer = dataResponse.defaultValues.BuildingValue;
        this.checkRoutes();
      }

      this.loader = false;
    },
      (error) => {
        //this.showMsgError = true;
        console.log(error);
        this.loader = false;
        //this.errormsg = error.message;
      });
  }

  get_charts() {

    this.loader = true;

    var fmls = localStorage.getItem('f_mls');

    this.api.get_charts(fmls).subscribe((dataResponse) => {

      const response = dataResponse.data;

      this.charts = response;

      //console.log(this.charts);

      if (localStorage.getItem('new-chart-created-resi')) {
        this.confValues.controls.propertyValueResSelect.setValue(localStorage.getItem('new-chart-created-resi'))
        //localStorage.removeItem('new-chart-created-resi');
        this.confValues.controls.checkpropertyfill.setValue(1);
        this.confValues.controls.propertyValueRes.setValue('');
      }

      if (localStorage.getItem('new-chart-created-rent')) {
        this.confValues.controls.propertyValueRenSelect.setValue(localStorage.getItem('new-chart-created-rent'))
        //localStorage.removeItem('new-chart-created-rent');
        this.confValues.controls.checkrentalfill.setValue(1);
        this.confValues.controls.propertyValueRental.setValue('');
      }

      this.loader = false;
    },
      error => {
        this.loader = false;
        console.log(error);
      });

  }

  getMlsDetails() {

    var mls = localStorage.getItem('f_mls');
    const body = {
      'id': mls,
    }

    this.api.get_mls_details(body).subscribe((dataResponse) => {
      //console.log(dataResponse.data);
      this.mls_name = dataResponse.data.name;
      this.isExtraFields = dataResponse.data.is_extra_fields;
      this.hasRental = dataResponse.data.hasRental;
      //console.log(this.isExtraFields);
      //console.log(this.hasRental);
    },
      error => {
        //this.loader = false;
        //this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
      });
  }

  confValueSubmit() {

    //console.log(this.confValues.value);

    this.loader = true;
    //var outlier = [];

    var formdata = [];
    formdata['agent'] = ''; //agent id

    if (this.Id == 'new-investment') {
      formdata['id'] = ''; //client id
    }
    else {
      formdata['id'] = this.Id; //client id
    }


    if (this.Id && this.Id != 'new-investment') {

      formdata['client'] = this.getinvestmentData.client;
      formdata['targetProperty'] = this.getinvestmentData.property_id;
      //return;
    }
    else {
      if (this.localStorage.propertyId != null) {
        formdata['client'] = this.localStorage.propertyId.client;
        formdata['targetProperty'] = this.localStorage.propertyId._id;
      }
      else {
        formdata['client'] = '';
        formdata['targetProperty'] = '';
      }
    }

    if (this.Id && this.Id != 'new-investment') {
      formdata['chart_title'] = this.getinvestmentData.chart_title;
      //return;
    }
    else {
      formdata['chart_title'] = this.localStorage.chart_title;
    }

    formdata['relatedProperty'] = { 'mls_id': localStorage.getItem('f_mls'), "mls": this.mls_name };
    //formdata['client'] = this.addchartclientid;

    var body = {
      'agent': formdata['agent'],
      'client': formdata['client'],
      'id': formdata['id'],
      'investment': this.confValues.value,
      'targetProperty': formdata['targetProperty'],
      'chart_title': formdata['chart_title'],
      'relatedProperty': formdata['relatedProperty']
    }

    console.log(body);
    //return false;

    var errorhtml;
    var errortitle;
    this.translate.get('APC Investment Analysis.Input Error').subscribe((text: string) => {
      //console.log(text)
      errorhtml = text;
    });

    this.translate.get('APC Investment Analysis.Loan to Value').subscribe((text: string) => {
      //console.log(text)
      errortitle = text;
    });

    this.api.addChartResponseInvestment(body).subscribe((dataResponse) => {
      //console.log(dataResponse);
      this.loader = true;

      //console.log(this.averagePropertyValue);
      var averagePropertyValue = this.averagePropertyValue
      var loanvalue = this.confValues.controls.loanvalue.value;
      var LoantoValue = this.confValues.controls.LoantoValue.value;

      var Smloanvalue = this.confValues.controls.SmLoantoValueorLoanAmount.value;
      var LoantoValueSm = this.confValues.controls.LoantoValueSm.value;

      var loanvalueFm;
      if (LoantoValue == '$') {
        loanvalueFm = loanvalue;
      }
      else {
        loanvalueFm = (loanvalue * averagePropertyValue) / 100;
      }

      var loanvalueSm;
      if (LoantoValueSm == '$') {
        loanvalueSm = Smloanvalue;
      }
      else {
        loanvalueSm = (Smloanvalue * averagePropertyValue) / 100;
      }

      var totalCheck = parseFloat(loanvalueFm) + parseFloat(loanvalueSm);

      if (totalCheck > averagePropertyValue) {
        Swal.fire({
          type: 'error',
          title: errorhtml,
          html: '<h6>' + errortitle + '<h6>',
          //footer: '<a href>Why do I have this issue?</a>'
          width: '25em',
          customClass: 'AnalisysSwal'
        });
        this.loader = false;
        console.log('failed');
        return false;
      }
      else {
        console.log('pass');
        this.save_to_db(dataResponse);
        this.loader = false;
      }

    },
      (error) => {
        this.loader = false;
        console.log(error);
      });

    //this.router.navigate(['investment-report']);
  }

  save_to_db(dataResponse) {
    this.api.save_chart_db(dataResponse.data).subscribe((dataResponse1) => {
      //console.log(dataResponse1);
      this.loader = false;
      localStorage.removeItem('investment-analysis');
      this.router.navigate(['/investment-report/' + dataResponse1._id]);
    },
      (error1) => {
        this.loader = false;
        console.log(error1);
      });
  }

  toggleAddvance() {

    this.showHideAddvance = !this.showHideAddvance;

    if (this.showHideAddvance) {

      this.confValues.controls.advanced.setValue('1');

      this.confValues.controls.Improvements.setValidators([Validators.required]);
      this.confValues.controls.Improvements.updateValueAndValidity();

      this.confValues.controls.TotalImprovementValue.setValidators([Validators.required]);
      this.confValues.controls.TotalImprovementValue.updateValueAndValidity();

      this.confValues.controls.landValue.setValidators([Validators.required]);
      this.confValues.controls.landValue.updateValueAndValidity();

      this.confValues.controls.BuildingValue.setValidators([Validators.required]);
      this.confValues.controls.BuildingValue.updateValueAndValidity();

      this.confValues.controls.RateofInflation.setValidators([Validators.required]);
      this.confValues.controls.RateofInflation.updateValueAndValidity();

      this.confValues.controls.HouseValueAppreciation.setValidators([Validators.required]);
      this.confValues.controls.HouseValueAppreciation.updateValueAndValidity();

      this.confValues.controls.CostofSale.setValidators([Validators.required]);
      this.confValues.controls.CostofSale.updateValueAndValidity();

      this.confValues.controls.EstimatedVacancy.setValidators([Validators.required]);
      this.confValues.controls.EstimatedVacancy.updateValueAndValidity();

      this.confValues.controls.NominalFederalIncomeTaxRate.setValidators([Validators.required]);
      this.confValues.controls.NominalFederalIncomeTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalStateIncomeTaxRate.setValidators([Validators.required]);
      this.confValues.controls.NominalStateIncomeTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalLocalIncomeTaxRate.setValidators([Validators.required]);
      this.confValues.controls.NominalLocalIncomeTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalStraightLineRecaptureTaxRate.setValidators([Validators.required]);
      this.confValues.controls.NominalStraightLineRecaptureTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalFederalCapitalGainTaxRate.setValidators([Validators.required]);
      this.confValues.controls.NominalFederalCapitalGainTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalStateCapitalGainTaxRate.setValidators([Validators.required]);
      this.confValues.controls.NominalStateCapitalGainTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalLocalCapitalGainTaxRate.setValidators([Validators.required]);
      this.confValues.controls.NominalLocalCapitalGainTaxRate.updateValueAndValidity();

      this.confValues.controls.Repairs.setValidators([Validators.required]);
      this.confValues.controls.Repairs.updateValueAndValidity();

      this.confValues.controls.RegimeFee.setValidators([Validators.required]);
      this.confValues.controls.RegimeFee.updateValueAndValidity();

      this.confValues.controls.hoa.setValidators([Validators.required]);
      this.confValues.controls.hoa.updateValueAndValidity();

      this.confValues.controls.Electric.setValidators([Validators.required]);
      this.confValues.controls.Electric.updateValueAndValidity();

      this.confValues.controls.Water.setValidators([Validators.required]);
      this.confValues.controls.Water.updateValueAndValidity();

      this.confValues.controls.Accounting.setValidators([Validators.required]);
      this.confValues.controls.Accounting.updateValueAndValidity();

      this.confValues.controls.Liscenses.setValidators([Validators.required]);
      this.confValues.controls.Liscenses.updateValueAndValidity();

      this.confValues.controls.Advertising.setValidators([Validators.required]);
      this.confValues.controls.Advertising.updateValueAndValidity();

      this.confValues.controls.Trash.setValidators([Validators.required]);
      this.confValues.controls.Trash.updateValueAndValidity();

      this.confValues.controls.monitoring.setValidators([Validators.required]);
      this.confValues.controls.monitoring.updateValueAndValidity();

      this.confValues.controls.maintenance.setValidators([Validators.required]);
      this.confValues.controls.maintenance.updateValueAndValidity();

      this.confValues.controls.Pest.setValidators([Validators.required]);
      this.confValues.controls.Pest.updateValueAndValidity();

      this.confValues.controls.Management.setValidators([Validators.required]);
      this.confValues.controls.Management.updateValueAndValidity();

      this.confValues.controls.Other.setValidators([Validators.required]);
      this.confValues.controls.Other.updateValueAndValidity();

      this.confValues.controls.EstimatedClosingCosts.setValidators([Validators.required]);
      this.confValues.controls.EstimatedClosingCosts.updateValueAndValidity();

      this.confValues.controls.DownpaymentorEquity.setValidators([Validators.required]);
      this.confValues.controls.DownpaymentorEquity.updateValueAndValidity();

    }
    else {

      this.confValues.controls.advanced.setValue('0');

      this.confValues.controls.Improvements.setValidators(null);
      this.confValues.controls.Improvements.updateValueAndValidity();

      this.confValues.controls.TotalImprovementValue.setValidators(null);
      this.confValues.controls.TotalImprovementValue.updateValueAndValidity();

      this.confValues.controls.landValue.setValidators(null);
      this.confValues.controls.landValue.updateValueAndValidity();

      this.confValues.controls.BuildingValue.setValidators(null);
      this.confValues.controls.BuildingValue.updateValueAndValidity();

      this.confValues.controls.RateofInflation.setValidators(null);
      this.confValues.controls.RateofInflation.updateValueAndValidity();

      this.confValues.controls.HouseValueAppreciation.setValidators(null);
      this.confValues.controls.HouseValueAppreciation.updateValueAndValidity();

      this.confValues.controls.CostofSale.setValidators(null);
      this.confValues.controls.CostofSale.updateValueAndValidity();

      this.confValues.controls.EstimatedVacancy.setValidators(null);
      this.confValues.controls.EstimatedVacancy.updateValueAndValidity();

      this.confValues.controls.NominalFederalIncomeTaxRate.setValidators(null);
      this.confValues.controls.NominalFederalIncomeTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalStateIncomeTaxRate.setValidators(null);
      this.confValues.controls.NominalStateIncomeTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalLocalIncomeTaxRate.setValidators(null);
      this.confValues.controls.NominalLocalIncomeTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalStraightLineRecaptureTaxRate.setValidators(null);
      this.confValues.controls.NominalStraightLineRecaptureTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalFederalCapitalGainTaxRate.setValidators(null);
      this.confValues.controls.NominalFederalCapitalGainTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalStateCapitalGainTaxRate.setValidators(null);
      this.confValues.controls.NominalStateCapitalGainTaxRate.updateValueAndValidity();

      this.confValues.controls.NominalLocalCapitalGainTaxRate.setValidators(null);
      this.confValues.controls.NominalLocalCapitalGainTaxRate.updateValueAndValidity();

      this.confValues.controls.Repairs.setValidators(null);
      this.confValues.controls.Repairs.updateValueAndValidity();

      this.confValues.controls.RegimeFee.setValidators(null);
      this.confValues.controls.RegimeFee.updateValueAndValidity();

      this.confValues.controls.hoa.setValidators(null);
      this.confValues.controls.hoa.updateValueAndValidity();

      this.confValues.controls.Electric.setValidators(null);
      this.confValues.controls.Electric.updateValueAndValidity();

      this.confValues.controls.Water.setValidators(null);
      this.confValues.controls.Water.updateValueAndValidity();

      this.confValues.controls.Accounting.setValidators(null);
      this.confValues.controls.Accounting.updateValueAndValidity();

      this.confValues.controls.Liscenses.setValidators(null);
      this.confValues.controls.Liscenses.updateValueAndValidity();

      this.confValues.controls.Advertising.setValidators(null);
      this.confValues.controls.Advertising.updateValueAndValidity();

      this.confValues.controls.Trash.setValidators(null);
      this.confValues.controls.Trash.updateValueAndValidity();

      this.confValues.controls.monitoring.setValidators(null);
      this.confValues.controls.monitoring.updateValueAndValidity();

      this.confValues.controls.maintenance.setValidators(null);
      this.confValues.controls.maintenance.updateValueAndValidity();

      this.confValues.controls.Pest.setValidators(null);
      this.confValues.controls.Pest.updateValueAndValidity();

      this.confValues.controls.Management.setValidators(null);
      this.confValues.controls.Management.updateValueAndValidity();

      this.confValues.controls.Other.setValidators(null);
      this.confValues.controls.Other.updateValueAndValidity();

      this.confValues.controls.EstimatedClosingCosts.setValidators(null);
      this.confValues.controls.EstimatedClosingCosts.updateValueAndValidity();

      this.confValues.controls.DownpaymentorEquity.setValidators(null);
      this.confValues.controls.DownpaymentorEquity.updateValueAndValidity();


    }

  }

  loanValue(check) {
    //console.log(check);
    if (check == 1) {
      this.lvalue = 'lvalue1';
      this.loanPlaceholder = '$';
      this.confValues.controls.LoantoValue.setValue('$');
      this.maxInput = '';
      this.confValues.controls.loanvalue.setValue('');
      this.confValues.controls.loanvalue.setValidators([Validators.required]);
      this.confValues.controls.loanvalue.updateValueAndValidity();
    } else {
      this.lvalue = 'lvalue2';
      this.loanPlaceholder = '%';
      this.confValues.controls.LoantoValue.setValue('%');
      this.maxInput = 100;
      this.confValues.controls.loanvalue.setValue('');
      this.confValues.controls.loanvalue.setValidators([Validators.pattern("^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"), Validators.min(0), Validators.max(100), Validators.required]);
      this.confValues.controls.loanvalue.updateValueAndValidity();

    }
    this.calculateDownpaymentorEquity();
  }

  calculateClosingCost() {
    var FmEstimatedClosingCosts = this.confValues.controls.FmEstimatedClosingCosts.value;
    var SmEstimatedClosingCosts = this.confValues.controls.SmEstimatedClosingCosts.value;
    //console.log(FmEstimatedClosingCosts,SmEstimatedClosingCosts);
    //EstimatedClosingCosts
    if (!FmEstimatedClosingCosts) {
      FmEstimatedClosingCosts = 0
    }
    if (!SmEstimatedClosingCosts) {
      SmEstimatedClosingCosts = 0
    }
    var EstimatedClosingCosts = parseFloat(FmEstimatedClosingCosts) + parseFloat(SmEstimatedClosingCosts)
    console.log(EstimatedClosingCosts);

    this.confValues.controls.EstimatedClosingCosts.setValue(EstimatedClosingCosts)
  }

  loanValueSm(check) {
    //console.log(check);
    if (check == 1) {
      this.lvalueSm = 'lvalue1';
      this.loanPlaceholderSm = '$';
      this.confValues.controls.LoantoValueSm.setValue('$');
      this.maxInputSm = '';
      this.confValues.controls.SmLoantoValueorLoanAmount.setValue('');
      this.confValues.controls.SmLoantoValueorLoanAmount.setValidators([Validators.required]);
      this.confValues.controls.SmLoantoValueorLoanAmount.updateValueAndValidity();
    } else {
      this.lvalueSm = 'lvalue2';
      this.loanPlaceholderSm = '%';
      this.confValues.controls.LoantoValueSm.setValue('%');
      this.maxInputSm = 100;
      this.confValues.controls.SmLoantoValueorLoanAmount.setValue('');
      this.confValues.controls.SmLoantoValueorLoanAmount.setValidators([Validators.pattern("^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"), Validators.min(0), Validators.max(100), Validators.required]);
      this.confValues.controls.SmLoantoValueorLoanAmount.updateValueAndValidity();

    }
    this.calculateDownpaymentorEquity();
  }

  get_chart_details(currentId) {

    let body = {
      "id": currentId
    };

    this.loader = true;
    this.api.get_chart_details_investment_with_header(body).subscribe((dataResponse) => {
      
      //console.log(dataResponse.data.investment);

      if (dataResponse.data.investment.LoantoValue == '$') {

        this.loanValue(1);

      } else {
        this.loanValue(0);

      }

      if (dataResponse.data.investment.LoantoValueSm == '$') {

        this.loanValueSm(1);

      } else {
        this.loanValueSm(0);

      }

      if (dataResponse.data.investment.advanced == '1') {
        this.showHideAddvance = true;
      } else {
        this.showHideAddvance = false;
      }

      this.getinvestmentData = dataResponse.data;
      if (dataResponse.data.investment && this.redirect == false) {
        //console.log(dataResponse.data.investment)
        this.confValues.patchValue(
          dataResponse.data.investment
        );

        //console.log(this.confValues.value)

        if (dataResponse.data.investment.propertyValueRes) {
          this.averagePropertyValue = dataResponse.data.investment.propertyValueRes;
        }

        this.confValues.controls.checkpropertyfill.setValue(1);
        this.confValues.controls.checkrentalfill.setValue(1);

        this.confValues.controls.propertyValueResSelect.setValue(dataResponse.data.investment.propertyValueRes_chart_id);
        this.confValues.controls.propertyValueRenSelect.setValue(dataResponse.data.investment.propertyValueRen_chart_id);
        this.confValues.controls.hoa.setValue(dataResponse.data.investment.annual_hoa);

          if(dataResponse.data.investment.propertyValueRes_chart_id){
            this.onProChange( dataResponse.data.investment.propertyValueRes_chart_id );
          }

          if(dataResponse.data.investment.propertyValueRes_chart_id){
            this.onRenChange( dataResponse.data.investment.propertyValueRen_chart_id );
          }

      }
      else {
        //console.log('else')
        this.fillFormWithOldData();
      }
      this.calculatePropAdjValue();
      this.loader = false;
    },
    error => {
      this.loader = false;
      console.log(error);
      if(error.message == "Chart not found for this user."){
        this.router.navigate(['/mycharts']);

      }
    });

  }

  fillFormWithOldData() {

    if(localStorage.getItem('investment_form_data')){
      this.confValues.patchValue(
        JSON.parse(localStorage.getItem('investment_form_data'))
      );
      //new-chart-created
      //console.log(this.charts);
      if (JSON.parse(localStorage.getItem('investment_form_data')).propertyValueRes) {
        this.confValues.controls.checkpropertyfill.setValue(1);
        //this.confValues.controls.propertyValueRental.setValue('');
      }
  
      if (JSON.parse(localStorage.getItem('investment_form_data')).propertyValueRental) {
        this.confValues.controls.checkrentalfill.setValue(1);
        //this.confValues.controls.propertyValueRental.setValue('');
      }
      localStorage.removeItem('investment_form_data');
    }
    

    if (localStorage.getItem('new-chart-created-resi')) {
      this.confValues.controls.propertyValueResSelect.setValue(localStorage.getItem('new-chart-created-resi'))
      localStorage.removeItem('new-chart-created-resi');
      this.confValues.controls.checkpropertyfill.setValue(1);
      this.confValues.controls.propertyValueRes.setValue('');
      this.onProChange(localStorage.getItem('new-chart-created-resi'));
    }

    if (localStorage.getItem('new-chart-created-rent')) {
      this.confValues.controls.propertyValueRenSelect.setValue(localStorage.getItem('new-chart-created-rent'))
      localStorage.removeItem('new-chart-created-rent');
      this.confValues.controls.checkrentalfill.setValue(1);
      this.confValues.controls.propertyValueRental.setValue('');
      this.onProChange(localStorage.getItem('new-chart-created-rent'));
      this.onRenChange(localStorage.getItem('new-chart-created-rent'));
    }

  }

  openChart(type) {
    //console.log(type);
    //console.log(this.confValues.value);
    localStorage.setItem('analysis_type', type);
    localStorage.setItem('remember_investment_id', this.Id);
    localStorage.setItem('investment_form_data', JSON.stringify(this.confValues.value));
    this.router.navigate(['/new-chart/property-value-analysis/redirectBackToAnalysis']);
  }

  openDialog(type) {
    //console.log(type);
    //const dialogRef = this.dialog.open(DialogPropertyComponent, {
    const dialogRef = this.dialog.open(NewClientComponent, {
      panelClass: 'property-dialog-container',
      data: {
        action: 'property'
      },
      width: '35em'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        console.log(type);
        localStorage.setItem('analysis_type', type);
        localStorage.setItem('remember_investment_id', this.Id);
        localStorage.setItem('investment_form_data', JSON.stringify(this.confValues.value));
        this.router.navigate(["/new-chart/property-value-analysis/redirectBackToAnalysis/new_client/"+(result.property_id+'/'+result.client_id)]);

      }
      //this.getClients();
      //this.getProperties();

    });

  }

  openDialogProspecting(type) {
    const dialogRef = this.dialog.open(ProspectingComponent, {
      panelClass: 'property-dialog-container',
      data: {
        action: 'client'
      },
      width: '35em'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        
        //console.log("/new-chart/property-value-analysis/redirectBackToAnalysis/prospecting/"+result.chart_title+'/'+result.sqr_ft);
        localStorage.setItem('analysis_type', type);
        localStorage.setItem('remember_investment_id', this.Id);
        localStorage.setItem('investment_form_data', JSON.stringify(this.confValues.value));
        this.router.navigate(["/new-chart/property-value-analysis/redirectBackToAnalysis/prospecting/"+encodeURIComponent(result.chart_title)+'/'+result.sqr_ft]);
      }
     
    });

  }

  getClients() {

    this.loader = true;
    this.apiChart.getClientList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
      const response = dataResponse;
      this.clients = response;
      this.route.params.subscribe(res => {
        //this.currentId = res.id;
        //console.log(this.currentId);
        //this.getProperty(this.currentId);
        /* this.validateAddMlsUserForm(this.currentId);
        this.getClient(this.currentId); */

      });
      //console.log(response);
      this.loader = false;
    },
      error => {
        this.loader = false;
        //this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
      });

  }
}
