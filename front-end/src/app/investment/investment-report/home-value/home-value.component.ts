import { Component, OnInit, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { CurrencyPipe } from '@angular/common';
import { ChartService } from 'src/app/services/chart.service';
import { TranslateService } from '@ngx-translate/core';
import { PpmtService } from 'src/app/services/ppmt.service';
import { SharedMlsService } from 'src/app/services/shared-mls.service';
import { ConvertPipe } from 'src/app/pipes/convert.pipe';

@Component({
  selector: 'app-home-value',
  templateUrl: './home-value.component.html',
  styleUrls: ['./home-value.component.scss'],
  providers: [DecimalPipe,ConvertPipe]
})
export class HomeValueComponent implements OnInit {
  @Input() currentcurrencyInt: any;
  Years;
  CashFlow;
  Fmterm = 5;
  loader = false;
  dic9;
  @Input() chartdata: any;
  @Input() plotRespResiDential: any;
  @Input() plotRespRental: any;
  averagePropertyValue;

  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips:{
      custom: function (tooltip) {
        if (!tooltip) return;
        // disable displaying the color box;
        tooltip.displayColors = false;
      }, 
      bodyFontColor: "#000000",
      bodyFontSize: 24,
      bodyFontStyle: "bold",
      titleFontColor: '#000000',
      footerFontSize: 21,
      footerFontColor: '#000000',
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: '#18558b',    
      /* callbacks: {
        title: function (t, e) {
          //console.log(t[0].xLabel);
          return "Year " + t[0].xLabel;
        },
        label: function (t, e) {
          let currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
          var price = t.yLabel;
          return " " + currencyPipe.transform(price, 'USD', 'symbol', "1.0-0");
        },
        
      }, */
      
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales:
    {
      xAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
        "scaleLabel": {
          "display": true,
          "labelString": this.Years,
          "fontFamily": "Verdana, Geneva, sans-serif",
          "fontSize": 24
        },
        "ticks": {
          minRotation: 45,
          "fontFamily": "Verdana, Geneva, sans-serif",
          autoSkip: true,
          "fontSize": 20,
         
        }
      }],
      yAxes: [{
        "scaleLabel": {
          "display": true,
          "labelString": this.CashFlow,
          "fontFamily": "Verdana, Geneva, sans-serif",
          "fontSize": 24
        },
        "ticks": {
          "fontFamily": "Verdana, Geneva, sans-serif",
          autoSkip: true,
          "fontSize": 20,
          /* callback: function (value) {
            var str = value + '';
            var length = str.length;
            if (length > 6) {
              return '$' + str.slice(0, -6) + ',' + str.slice(-6, -3) + ',' + str.slice(-3);
            } else if (length > 3) {
              return '$' + str.slice(0, -3) + ',' + str.slice(-3);
            } else {
              return '$' + str;
            }
          } */
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Home Value' }
  ];

  public barChartColors: Color[] = [
    { backgroundColor: '#0BA1FA' },
    { backgroundColor: '#5EE8CF' },
    { backgroundColor: '#6AD837' },
    { backgroundColor: '#FAE33B' }
  ];

  mls_name;

  RentalIncome = [];
  VacancyLoss = [];
  GrossOperatingIncome = [];
  TotalOperatingExpense = [];
  TotalExpenses = [];

  firstMortgageInterestTable = [];
  firstMortgageInterest = [];
  firstMortgagePrincipalTable = [];
  firstMortgagePrincipal = [];

  secondMortgageInterestTable = [];
  secondMortgageInterest = [];
  secondMortgagePrincipalTable = [];
  secondMortgagePrincipal = [];

  TotalPrincipalPayments = [];

  TotalIntersetPaidFm = [];
  TotalBalanceFm = [];

  TotalIntersetPaidSm = [];
  TotalBalanceSm = [];
  FirstMortgageBalance = []
  SecondMortgageBalance = []

  HomeEquity = [];

  cashFlowBeforeTaxes = [];

  UsefulLife = 27.5;
  BuildingValue = 0;
  AnnualDepreciation = [];
  RealEstateTaxableIncome = [];
  NominalTaxRate;
  TaxSavings = [];
  SalesPrice = []
  AnnualHomeValueAppreciation = [];
  PurchaseCost = [];
  currentcurrency = 'USD';

  constructor(private converterpipe: ConvertPipe,private sharedMlsService: SharedMlsService,private _decimalPipe: DecimalPipe,
    private api: ChartService, 
    public translate: TranslateService,
    private ppmt: PpmtService) { 

      this.sharedMlsService.dataString2$.subscribe(
        data => {
          this.currentcurrency = data;
          //console.log(data);
          this.generateChart(this.dic9);
          //this.gotSearchData(data);
        });

    }

  ngOnInit() {

    this.currentcurrency = this.currentcurrencyInt;
    
    this.calculateAveragePropertyValue();

    this.translate.get('APC Investment Analysis.Years').subscribe((text2: string) => {
      this.Years = text2;
      this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = this.Years;
    });

    this.translate.get('APC Investment Analysis.Home Value$').subscribe((text2: string) => {
      //console.log(text2);
      this.CashFlow = text2;
      this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = this.CashFlow;
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

  createNewHighCashflow() {

    //console.log(this.Fmterm);

    if (this.Fmterm == 5) {
      this.Fmterm = 10;
    }
    else if (this.Fmterm == 10) {
      this.Fmterm = 30;
    }
    //this.Fmterm = 10;

    //console.log(this.Fmterm);
    this.generateChart(this.dic9);
  }

  createNewLowCashflow() {
    //this.Fmterm = 5;

    //console.log(this.Fmterm);

    if (this.Fmterm == 30) {
      this.Fmterm = 10;
    }
    else if (this.Fmterm == 10) {
      this.Fmterm = 5;
    }
    //console.log(this.Fmterm);
    this.generateChart(this.dic9);
  }

  calculateGrossOperatingIncome() {
    
    if(this.chartdata.investment.propertyValueRen_chart_id){
      
      this.loader = true;
      //this.api.get_chart_details(body).subscribe((dataResponse) => {
      
      var plotResp = this.plotRespRental;
      
      this.dic9 = (Math.round(plotResp.estimated_home_value.sales_price.lower_bound)+Math.round(plotResp.estimated_home_value.sales_price.upper_bound))/2;
      this.generateChart(this.dic9);
      this.loader = false;
      //});
    }
    else{
      this.dic9 = this.chartdata.investment.propertyValueRental;
      this.generateChart(this.dic9);
    }
    //CashFlowBeforeTaxes
  }

  calculateAveragePropertyValue(){
    if(this.chartdata.investment.propertyValueRes_chart_id){
      
      this.loader = true;
      //this.api.get_chart_details(body).subscribe((dataResponse) => {
        
        var plotResp = this.plotRespResiDential;
        
        this.averagePropertyValue = (Math.round(plotResp.estimated_home_value.sales_price.lower_bound)+Math.round(plotResp.estimated_home_value.sales_price.upper_bound))/2;

        this.BuildingValue = parseFloat(this.chartdata.investment.BuildingValue) + parseFloat(this.chartdata.investment.Improvements);//this.averagePropertyValue*70/100;        //this.AnnualDepreciation = Math.ceil(this.BuildingValue/this.UsefulLife);

        for (let index = 0; index < 30; index++) {
            
          if(index == 27){
            this.AnnualDepreciation.push(Math.round((this.BuildingValue/this.UsefulLife)/2));
          }
          else if(index > 27){
            this.AnnualDepreciation.push(0);
          }
          else{
            this.AnnualDepreciation.push(Math.round(this.BuildingValue/this.UsefulLife));
          }
          this.PurchaseCost.push( parseFloat(this.chartdata.investment.BuildingValue) + parseFloat(this.chartdata.investment.landValue) + parseFloat(this.chartdata.investment.Improvements) );
        }

        //this.generateChart(this.dic9);
        this.loader = false;
        this.calculateGrossOperatingIncome()
      //});
    }
    else
    {
      this.averagePropertyValue = parseFloat(this.chartdata.investment.propertyValueRes);
      this.BuildingValue = parseFloat(this.chartdata.investment.BuildingValue) + parseFloat(this.chartdata.investment.Improvements);//this.averagePropertyValue*70/100;      //this.AnnualDepreciation = Math.ceil(this.BuildingValue/this.UsefulLife);
      for (let index = 0; index < 30; index++) {
            
        if(index == 27){
          this.AnnualDepreciation.push(Math.round((this.BuildingValue/this.UsefulLife)/2));
        }
        else if(index > 27){
          this.AnnualDepreciation.push(0);
        }
        else{
          this.AnnualDepreciation.push(Math.round(this.BuildingValue/this.UsefulLife));
        }
        this.PurchaseCost.push( parseFloat(this.chartdata.investment.BuildingValue) + parseFloat(this.chartdata.investment.landValue) + parseFloat(this.chartdata.investment.Improvements) );
      }
      this.calculateGrossOperatingIncome()
      //this.generateChart(this.dic9);
    }
  }

  generateChart(dic9){

    var $this = this;

    this.barChartOptions.scales.yAxes = [{
      "scaleLabel": {
        "display": true,
        "labelString": this.CashFlow,
        "fontFamily": "Verdana, Geneva, sans-serif",
        "fontSize": 24
      },
      "ticks": {
        "fontFamily": "Verdana, Geneva, sans-serif",
        autoSkip: true,
        "fontSize": 20,
        callback: function (value) {
          return $this.converterpipe.transform(value, $this.currentcurrency, '1.0-0');
        }
      }
    }];

    this.barChartOptions.tooltips = {
      custom: function (tooltip) {
        if (!tooltip) return;
        // disable displaying the color box;
        tooltip.displayColors = false;
      }, 
      bodyFontColor: "#000000",
      bodyFontSize: 24,
      bodyFontStyle: "bold",
      titleFontColor: '#000000',
      footerFontSize: 21,
      footerFontColor: '#000000',
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: '#18558b',    
      callbacks: {
        title: function (t, e) {
          //console.log(t[0].xLabel);
          return "Year " + t[0].xLabel;
        },
        label: function (t, e) {
          var price = t.yLabel;
          return $this.converterpipe.transform(price, $this.currentcurrency, '1.0-0');
        },
        
      },
    }
    
    var dic12 = this.chartdata.investment.RateofInflation/100;
    var dic13 = this.chartdata.investment.HouseValueAppreciation/100;
    var lastValue;
    var rentalFirstValue = Math.round(dic9)*12;
    var dic26 = this.chartdata.investment.FmInterestRate/100;
    
    //if(this.chartdata.investment.FmTerm > 5){

    //this.chartdata.investment.FmTerm = this.Fmterm;

    //}

    //console.log('averagePropertyValue'+this.averagePropertyValue);
    //console.log(this.chartdata.investment);
    var dic25;
    if(this.chartdata.investment.LoantoValue == '$'){
      dic25 = this.chartdata.investment.loanvalue;
    }
    else{
      dic25 = (this.averagePropertyValue*this.chartdata.investment.loanvalue)/100
    }

    //console.log(dic25);

    var dic27 = this.chartdata.investment.FmTerm;
    
    var dic31 = this.chartdata.investment.SmInterestRate / 100;
    var dic32 = this.chartdata.investment.SmTerm;
    var dic30;
    if(this.chartdata.investment.LoantoValueSm == '$'){
      dic30 = this.chartdata.investment.SmLoantoValueorLoanAmount;
    }
    else{
      dic30 = (this.averagePropertyValue*this.chartdata.investment.SmLoantoValueorLoanAmount)/100
    }
    
    var EstimatedVacancy = this.chartdata.investment.EstimatedVacancy;
    var NominalFederalIncomeTaxRate = this.chartdata.investment.NominalFederalIncomeTaxRate;
    var NominalStateIncomeTaxRate = this.chartdata.investment.NominalStateIncomeTaxRate;
    this.NominalTaxRate = 0;
    this.NominalTaxRate = (parseFloat(EstimatedVacancy)+parseFloat(NominalFederalIncomeTaxRate)+parseFloat(NominalStateIncomeTaxRate))/100;
    /* console.log(this.NominalTaxRate); */
    this.RentalIncome = [];
    this.VacancyLoss = [];
    this.GrossOperatingIncome = [];
    this.TotalOperatingExpense = [];
    this.TotalExpenses = [];

    this.firstMortgageInterestTable = [];
    this.firstMortgageInterest = [];
    this.firstMortgagePrincipalTable = [];
    this.firstMortgagePrincipal = [];

    this.secondMortgageInterestTable = [];
    this.secondMortgageInterest = [];
    this.secondMortgagePrincipalTable = [];
    this.secondMortgagePrincipal = [];

    this.TotalPrincipalPayments = [];

    this.cashFlowBeforeTaxes = [];
    this.RealEstateTaxableIncome = [];
    
    this.RentalIncome.push(rentalFirstValue);
    this.VacancyLoss.push(rentalFirstValue*(EstimatedVacancy/100));
    this.GrossOperatingIncome.push(rentalFirstValue-(rentalFirstValue*(EstimatedVacancy/100)));
    
    var dic36 = parseFloat(this.chartdata.investment.rtaxes)
    var dic37 = parseFloat(this.chartdata.investment.propertyInsurance)
    var dic38 = parseFloat(this.chartdata.investment.annual_hoa)*12;

    var dic39 = parseFloat(this.chartdata.investment.Repairs)
    var dic40 = parseFloat(this.chartdata.investment.Electric)
    var dic41 = parseFloat(this.chartdata.investment.Water)
    var dic42 = parseFloat(this.chartdata.investment.Accounting)
    var dic43 = parseFloat(this.chartdata.investment.Liscenses)
    var dic44 = parseFloat(this.chartdata.investment.Advertising)
    var dic45 = parseFloat(this.chartdata.investment.Trash)
    var dic46 = parseFloat(this.chartdata.investment.monitoring)
    var dic47 = parseFloat(this.chartdata.investment.maintenance)
    var dic48 = parseFloat(this.chartdata.investment.Pest)
    var dic49 = parseFloat(this.chartdata.investment.Management)
    var dic50 = parseFloat(this.chartdata.investment.Other)

    //console.log((dic36+dic37+dic38)-12*(dic39+dic40+dic41+dic42+dic43+dic44+dic45+dic46+dic47+dic48+dic49+dic50));
    this.TotalOperatingExpense.push((dic36+dic37+dic38)+12*(dic39+dic40+dic41+dic42+dic43+dic44+dic45+dic46+dic47+dic48+dic49+dic50));
    //this.SalesPrice.push( Math.round(this.averagePropertyValue*(1+dic13)) );
    this.AnnualHomeValueAppreciation.push( Math.round(this.PurchaseCost[0]*dic13) );
    //console.log(this.AnnualHomeValueAppreciation);
    this.SalesPrice.push( Math.round(this.PurchaseCost[0]+this.AnnualHomeValueAppreciation[0]) );

    for (let index = 1; index < 30; index++) {
      lastValue = this.RentalIncome[index-1];
      //console.log("lastValue-"+lastValue);
      var newValue = lastValue * (1 + dic12);
      //console.log("newValue-"+newValue);
      lastValue = newValue;
      this.RentalIncome.push(newValue);
      
      this.VacancyLoss.push(this.RentalIncome[index]*(EstimatedVacancy/100));
      this.GrossOperatingIncome.push( Math.round((this.RentalIncome[index]-this.VacancyLoss[index])) );
      this.TotalOperatingExpense.push(this.TotalOperatingExpense[index-1]*(1+dic12));
      this.SalesPrice.push( Math.round(this.SalesPrice[index-1]*(1+dic13)) );
      this.AnnualHomeValueAppreciation.push( Math.round(this.SalesPrice[index-1]*dic13 ));
      //console.log( this.IPMT (.045/12,index,30*12,177600,0,0 ));
      //this.SalesPrice.push( Math.round(this.PurchaseCost[index]+this.AnnualHomeValueAppreciation[index]) );

    }

    this.barChartData = [
      { data: [], label: 'Home Value' }
    ];

    this.barChartLabels = [];

    for (let index = 0; index < this.Fmterm; index++) {

      this.barChartLabels.push("" + (index + 1) + "");

      (this.barChartData[0].data as number[]).push(this.SalesPrice[index]);

    }
    
  }

  convertTONumber(value,format){
    if(isNaN(value)){
      return 0;
    }
    else{
      return parseFloat(this.noComma(this._decimalPipe.transform(value,format)));
    }
  }

}
