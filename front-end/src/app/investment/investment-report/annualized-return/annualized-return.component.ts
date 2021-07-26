import { Component, OnInit, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { CurrencyPipe } from '@angular/common';
import { ChartService } from 'src/app/services/chart.service';
import { TranslateService } from '@ngx-translate/core';
import { PpmtService } from 'src/app/services/ppmt.service';

@Component({
  selector: 'app-annualized-return',
  templateUrl: './annualized-return.component.html',
  styleUrls: ['./annualized-return.component.scss'],
  providers: [DecimalPipe]
})
export class AnnualizedReturnComponent implements OnInit {

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
      callbacks: {
        title: function (t, e) {
          //console.log(t[0].xLabel);
          return "Year " + t[0].xLabel;
        },
        label: function (t, e) {
          //let currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
          var price = t.yLabel;
          return " " + price+"%";
        },
        
      },
      
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
          beginAtZero: true,
          maxTicksLimit:4,
          "fontFamily": "Verdana, Geneva, sans-serif",
          autoSkip: true,
          "fontSize": 20,
          callback: function (value) {
            var str = value + '';
            //var length = str.length;
            let decimalPipe: DecimalPipe = new DecimalPipe('en-US');
            //console.log(decimalPipe.transform(str,'1.2-2'));
            return decimalPipe.transform(str,'1.2-2')+'%';
             
          }
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
    { data: [], label: 'Annualized Rate of Return' }
    
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

  cashFlowBeforeTaxes = [];
  CashFlowAfterTaxes = [];

  TotalIntersetPaidFm = [];
  TotalBalanceFm = [];

  TotalIntersetPaidSm = [];
  TotalBalanceSm = [];
  FirstMortgageBalance = []
  SecondMortgageBalance = []

  UsefulLife = 27.5;
  BuildingValue = 0;
  AnnualDepreciation = [];
  RealEstateTaxableIncome = [];
  NominalTaxRate;
  TaxSavings = [];
  SalesPrice = []
  CostofSale = [];
  SaleProceedsBeforeTax = [];

  TotalDepreciation = [];
  StraightLineRecapture = [];
  PurchaseCost = [];
  AdjustedBasisatSale = [];

  AnnualHomeValueAppreciation = [];
  firstMortgageInterestNew = [];
  firstMortgagePrincipalNew = [];
  secondMortgageInterestNew = [];
  secondMortgagePrincipalNew = [];
  TotalGainonSale = [];
  SaleStraightLineRecapture = [];
  CapitalGainsTax = [];
  SalesProceedsAfterTax = [];
  CashFlowYears = [];
  AnnualizedRateofReturn = [];

  constructor(private _decimalPipe: DecimalPipe,
    private api: ChartService, 
    public translate: TranslateService,
    private ppmt: PpmtService) { }

    ngOnInit() {

      this.calculateAveragePropertyValue();
  
      this.translate.get('APC Investment Analysis.Years').subscribe((text2: string) => {
        this.Years = text2;
        this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = this.Years;
      });
  
      this.translate.get('APC Investment Analysis.Annualized Rate of Return%').subscribe((text2: string) => {
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

          this.BuildingValue = parseFloat(this.chartdata.investment.BuildingValue) + parseFloat(this.chartdata.investment.Improvements);//this.averagePropertyValue*70/100;          
          
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
        this.BuildingValue = parseFloat(this.chartdata.investment.BuildingValue) + parseFloat(this.chartdata.investment.Improvements);//this.averagePropertyValue*70/100;        
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
      
      this.firstMortgageInterestNew = [];
      this.firstMortgagePrincipalNew = [];
      this.secondMortgageInterestNew = [];
      this.secondMortgagePrincipalNew = [];
  
      this.TotalPrincipalPayments = [];
  
      this.cashFlowBeforeTaxes = [];
      this.RealEstateTaxableIncome = [];
      this.TaxSavings = [];
      this.CashFlowAfterTaxes = [];

      this.SalesPrice = [];
      this.CostofSale = [];
      //this.TotalDepreciation = [];
      this.AdjustedBasisatSale = [];
      this.CapitalGainsTax = [];


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
      
      //CostofSale
      this.AnnualHomeValueAppreciation.push( Math.round(this.PurchaseCost[0]*dic13) );
      //console.log(this.AnnualHomeValueAppreciation);
      
      this.TotalDepreciation.push(this.AnnualDepreciation[0]);
      this.AdjustedBasisatSale.push(this.PurchaseCost[0]-this.TotalDepreciation[0]);
      this.SalesPrice.push( Math.round(this.PurchaseCost[0]+this.AnnualHomeValueAppreciation[0]) );
      this.CostofSale.push( Math.round( (this.SalesPrice[0]*this.chartdata.investment.CostofSale/100) ) );

      for (let index = 1; index < 30; index++) {
        lastValue = this.RentalIncome[index-1];
        //console.log("lastValue-"+lastValue);
        var newValue = lastValue * (1 + dic12);
        //console.log("newValue-"+newValue);
        lastValue = newValue;
        this.RentalIncome.push(newValue);
        
        this.VacancyLoss.push(this.RentalIncome[index]*(EstimatedVacancy/100));
        this.GrossOperatingIncome.push( Math.round((this.RentalIncome[index]-this.VacancyLoss[index])) );
        this.TotalOperatingExpense.push( Math.round(this.TotalOperatingExpense[index-1]*(1+dic12)));
        this.SalesPrice.push( Math.round( this.SalesPrice[index-1]*(1+dic13) ) );
        this.CostofSale.push( Math.round( ( this.SalesPrice[index-1]*(1+dic13)*this.chartdata.investment.CostofSale/100) ) );
        this.AnnualHomeValueAppreciation.push( Math.round(this.SalesPrice[index-1]*dic13 ));
        //this.SalesPrice.push( Math.round(this.PurchaseCost[index]+this.AnnualHomeValueAppreciation[index]) );
        this.TotalDepreciation.push(this.TotalDepreciation[index-1]+this.AnnualDepreciation[index-1]);
        this.AdjustedBasisatSale.push(this.PurchaseCost[index]-this.TotalDepreciation[index]);
        //console.log( this.IPMT (.045/12,index,30*12,177600,0,0 ));
      }

      for (let index = 1; index <= dic27 * 12; index++) {
  
        var rate = dic26 / 12;
        var period = index;
        var num_of_per = dic27*12;
        var present_value = dic25;
        
        this.firstMortgageInterestTable.push( this.convertTONumber(-this.ppmt.IPMT(rate,period,num_of_per,present_value,0,0 ),'1.0-2'));

      }

      for (let index = 1; index <= dic32 * 12; index++) {
  
        var rate1 = dic31 / 12;
        var period1 = index;
        var num_of_per1 = dic32 * 12;
        var present_value1 = dic30;
        
        this.secondMortgageInterestTable.push( this.convertTONumber(-this.ppmt.IPMT(rate1,period1,num_of_per1,present_value1,0,0 ),'1.0-2'));
      }
  
      for (let index = 1; index <= dic27 * 12; index++) {
        var rate = dic26 / 12;
        var period = index;
        var num_of_per = dic27*12;
        var present_value = dic25;
        
        this.firstMortgagePrincipalTable.push( this.convertTONumber(-this.ppmt.PPMT(rate,period,num_of_per,present_value,0,0 ),'1.0-2'));
  
      }

      for (let index = 1; index <= dic32 * 12; index++) {

        var rate1 = dic31 / 12;
        var period1 = index;
        var num_of_per1 = dic32 * 12;
        var present_value1 = dic30;
        
        this.secondMortgagePrincipalTable.push( this.convertTONumber(-this.ppmt.PPMT(rate1,period1,num_of_per1,present_value1,0,0 ),'1.0-2'));
      }
  
      this.barChartData = [
        { data: [], label: 'Cash Flow Before Taxes1' },
       
        //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
      ];
  
      this.barChartLabels = [];

      this.TotalIntersetPaidFm = [];
      this.TotalBalanceFm = [];
      this.TotalIntersetPaidSm = [];
      this.TotalBalanceSm = [];
      this.FirstMortgageBalance = [];
      this.SecondMortgageBalance = [];
      this.TotalGainonSale = [];
      this.StraightLineRecapture = [];
      this.SaleStraightLineRecapture = [];
      this.SalesProceedsAfterTax = [];
      this.CashFlowYears = [];
      this.SaleProceedsBeforeTax = [];
      this.AnnualizedRateofReturn = [];

      for (let index = 0; index < this.Fmterm; index++) {
  
        //this.barChartLabels.push("" + (index + 1) + "");
        this.barChartLabels.push("" + (index + 1) + "");
  
        var sum = 0;
        var sum1 = 0;
  
        var sumS = 0;
        var sum1S = 0;
  
        for (let index1 = index*12; index1 < (index+1)*12; index1++) {
          var val = this.convertTONumber(this.firstMortgageInterestTable[index1],'1.0-2');
          var val1 = this.convertTONumber(this.firstMortgagePrincipalTable[index1],'1.0-2');
          sum =  this.convertTONumber(sum+val,'1.0-2');
          sum1 =  this.convertTONumber(sum1+val1,'1.0-2');
  

          this.firstMortgageInterestNew.push(val)
          this.firstMortgagePrincipalNew.push(val1);

          var valS = this.convertTONumber(this.secondMortgageInterestTable[index1],'1.0-2');
          var val1S = this.convertTONumber(this.secondMortgagePrincipalTable[index1],'1.0-2');
          sumS =  this.convertTONumber(sumS+valS,'1.0-2');
          sum1S =  this.convertTONumber(sum1S+val1S,'1.0-2');

          this.secondMortgageInterestNew.push(valS)
          this.secondMortgagePrincipalNew.push(val1S);
        }
  
        this.firstMortgageInterest.push(this.convertTONumber(sum,'1.0-0'));
        this.secondMortgageInterest.push(this.convertTONumber(sumS,'1.0-0'));
        this.TotalExpenses.push(this.convertTONumber(this.firstMortgageInterest[index]+this.secondMortgageInterest[index]+this.TotalOperatingExpense[index],'1.0-0'));
        
        this.firstMortgagePrincipal.push(this.convertTONumber(sum1,'1.0-0'));
        this.secondMortgagePrincipal.push(this.convertTONumber(sum1S,'1.0-0'));

        this.cashFlowBeforeTaxes.push(this.convertTONumber(this.GrossOperatingIncome[index]-this.TotalExpenses[index]-this.firstMortgagePrincipal[index]-this.secondMortgagePrincipal[index],'1.0-0'));
        //this.AnnualHomeValueAppreciation.push()
        
        this.TaxSavings.push( Math.round(-(this.convertTONumber(this.GrossOperatingIncome[index],'1.0-0')-this.convertTONumber(this.TotalExpenses[index],'1.0-0')-this.AnnualDepreciation[index])*this.NominalTaxRate));

        this.CashFlowAfterTaxes.push( (this.cashFlowBeforeTaxes[index]+this.TaxSavings[index]));


        for (let index1 = (index*12); index1 < (index+1)*12; index1++) {

          if(this.firstMortgageInterestNew[index1-1]){
            this.TotalIntersetPaidFm.push(this.convertTONumber((this.firstMortgageInterestNew[index1]+this.TotalIntersetPaidFm[index1-1]),'1.0-2'));
            this.TotalBalanceFm.push( this.convertTONumber((this.TotalBalanceFm[index1-1]-this.firstMortgagePrincipalNew[index1]),'1.0-2'));
            
          }
          else{
            this.TotalIntersetPaidFm.push(this.convertTONumber(this.firstMortgageInterestNew[index1],'1.0-2'));
            this.TotalBalanceFm.push( this.convertTONumber((parseFloat(dic25)-this.firstMortgagePrincipalNew[index1]),'1.0-2'));
          }
  
          if(this.secondMortgageInterestNew[index1-1]){
            this.TotalIntersetPaidSm.push(this.convertTONumber((this.secondMortgageInterestNew[index1]+this.TotalIntersetPaidSm[index1-1]),'1.0-2'));
            this.TotalBalanceSm.push( this.convertTONumber((this.TotalBalanceSm[index1-1]-this.secondMortgagePrincipalNew[index1]),'1.0-2'));
            
          }
          else{
            this.TotalIntersetPaidSm.push(this.convertTONumber(this.secondMortgageInterestNew[index1],'1.0-2'));
            this.TotalBalanceSm.push( this.convertTONumber((parseFloat(dic30)-this.secondMortgagePrincipalNew[index1]),'1.0-2'));
          }
          
        }
  
        this.FirstMortgageBalance.push( Math.round( this.TotalBalanceFm[((index+1)*12)-1]) );
        this.SecondMortgageBalance.push( Math.round( this.TotalBalanceSm[((index+1)*12)-1]) );
        this.SaleProceedsBeforeTax.push( this.SalesPrice[index]-this.CostofSale[index]-this.FirstMortgageBalance[index]-this.SecondMortgageBalance[index] );
        this.TotalGainonSale.push(this.PurchaseCost[index]-this.AdjustedBasisatSale[index]-this.CostofSale[index])
        this.StraightLineRecapture.push( -Math.min(this.TotalGainonSale[index],-this.TotalDepreciation[index]));
        this.SaleStraightLineRecapture.push( Math.round(this.StraightLineRecapture[index]*this.chartdata.investment.NominalStraightLineRecaptureTaxRate/100));
        this.CapitalGainsTax.push( Math.round(this.TotalGainonSale[index]*((this.chartdata.investment.NominalFederalCapitalGainTaxRate/100)+(this.chartdata.investment.NominalStateCapitalGainTaxRate/100)+(this.chartdata.investment.NominalLocalCapitalGainTaxRate/100))));
        this.SalesProceedsAfterTax.push(this.SaleProceedsBeforeTax[index]-this.SaleStraightLineRecapture[index]-this.CapitalGainsTax[index]);

        this.CashFlowYears.push([]);

        for (let index22 = 0; index22 <= index+1; index22++) {
          //const element = array[index];
          if(index22 == 0){
            this.CashFlowYears[index][index22] = -(this.chartdata.investment.DownpaymentorEquity);
          }
          else if(index22 == index+1){
            //console.log(index+"-last-"+this.CashFlowAfterTaxes[index]+"+"+this.SalesProceedsAfterTax[index])
            this.CashFlowYears[index][index22]= this.CashFlowAfterTaxes[index]+this.SalesProceedsAfterTax[index];
          }
          else{
            //console.log("index--"+index);
            //console.log("index22--"+index22);
            this.CashFlowYears[index][index-index22+1]= this.cashFlowBeforeTaxes[index-index22];
          }
          
        }

        this.AnnualizedRateofReturn.push( this.convertTONumber(this.IRR(this.CashFlowYears[index]),'1.0-1'));
        
        /* if(index >= this.chartdata.investment.FmTerm){
          
          (this.barChartData[0].data as number[]).push( 0 );
          
        }
        else
        { */
          (this.barChartData[0].data as number[]).push(this.AnnualizedRateofReturn[index] );

        //}

        
      }

      //console.log(this.AnnualizedRateofReturn);
    }


    IRR(values, guess = undefined) {
      // Credits: algorithm inspired by Apache OpenOffice
      
      // Calculates the resulting amount
      var irrResult = function(values, dates, rate) {
        var r = rate + 1;
        var result = values[0];
        for (var i = 1; i < values.length; i++) {
          result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
        }
        return result;
      }
    
      // Calculates the first derivation
      var irrResultDeriv = function(values, dates, rate) {
        var r = rate + 1;
        var result = 0;
        for (var i = 1; i < values.length; i++) {
          var frac = (dates[i] - dates[0]) / 365;
          result -= frac * values[i] / Math.pow(r, frac + 1);
        }
        return result;
      }
    
      // Initialize dates and check that values contains at least one positive value and one negative value
      var dates = [];
      var positive = false;
      var negative = false;
      for (var i = 0; i < values.length; i++) {
        dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
        if (values[i] > 0) positive = true;
        if (values[i] < 0) negative = true;
      }
      
      // Return error if values does not contain at least one positive value and one negative value
      if (!positive || !negative) return '#NUM!';
    
      // Initialize guess and resultRate
      var guess = (typeof guess === 'undefined') ? 0.1 : guess;
      var resultRate = guess;
      
      // Set maximum epsilon for end of iteration
      var epsMax = 1e-10;
      
      // Set maximum number of iterations
      var iterMax = 50;
    
      // Implement Newton's method
      var newRate, epsRate, resultValue;
      var iteration = 0;
      var contLoop = true;
      do {
        resultValue = irrResult(values, dates, resultRate);
        newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
        epsRate = Math.abs(newRate - resultRate);
        resultRate = newRate;
        contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
      } while(contLoop && (++iteration < iterMax));
    
      if(contLoop) return '#NUM!';
    
      // Return internal rate of return
      return resultRate*100;
    }

    convertTONumber(value,format){
      //console.log(value,format);
      
      if(isNaN(value)){
        return 0;
      }
      else{
        return parseFloat(this.noComma(this._decimalPipe.transform(value,format)));
      }
      
    }

}
