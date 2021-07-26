import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChartService } from "../../services/chart.service";

@Component({
  selector: 'app-conf-values',
  templateUrl: './conf-values.component.html',
  styleUrls: ['./conf-values.component.scss']
})
export class ConfValuesComponent implements OnInit {

  currentId: any;
  confValues:any;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  minimumDate = new Date();
  status: boolean = false;
  loader = false;

  constructor(public route: ActivatedRoute,
    public api: DashboardService,
    private formBuilder: FormBuilder,
    private router:Router,
    public mlsapi: ChartService) { }

  ngOnInit() {
    this.validateDefaultValuesForm();
    this.getDefaultValues();

  }

  toggle(){
    this.status = !this.status;
    if(this.status){
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 250 + 'px';
    }else{
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 80 + 'px';
    }
  }

  getDefaultValues(){
    this.loader = true;
    this.api.get_default_values().subscribe((dataResponse) => {
      console.log(dataResponse.defaultValues);
      //this.showMsgSuccess = true;
      //window.scroll(0,0);
      if(dataResponse.defaultValues){
        this.confValues.patchValue(
          dataResponse.defaultValues
        );
      }
      
      this.loader = false;
    },
    (error)=>{
      //this.showMsgError = true;
      console.log(error);
      this.loader = false;
      //this.errormsg = error.message;
    });
  }

  validateDefaultValuesForm(){

    this.confValues =  this.formBuilder.group({

      //_id:[currentId],
      Improvements: ['', [ Validators.required]],
      TotalImprovementValue: ['', [ Validators.required]],
      BuildingValue: ['', [ Validators.required]],
      RateofInflation: ['', [ Validators.required]],
      HouseValueAppreciation: ['', [ Validators.required]],
      CostofSale: ['', [ Validators.required]],
      EstimatedVacancy: ['', [ Validators.required]],
      NominalFederalIncomeTaxRate: ['', [ Validators.required]],
      NominalStateIncomeTaxRate: ['', [ Validators.required]],
      NominalLocalIncomeTaxRate: ['', [ Validators.required]],
      NominalStraightLineRecaptureTaxRate: ['', [ Validators.required]],
      NominalFederalCapitalGainTaxRate: ['', [ Validators.required]],
      NominalStateCapitalGainTaxRate: ['', [ Validators.required]],
      NominalLocalCapitalGainTaxRate: ['', [ Validators.required]],
      FmInterestRate: ['', [ Validators.required]],
      FmTerm: ['', [ Validators.required]],
      SmLoantoValueorLoanAmount: ['', [ Validators.required]],
      SmInterestRate: ['', [ Validators.required]],
      SmTerm: ['', [ Validators.required]],
      Hoa: ['', [ Validators.required]],
      Repairs: ['', [ Validators.required]],
      Electric: ['', [ Validators.required]],
      Water: ['', [ Validators.required]],
      Accounting: ['', [ Validators.required]],
      Liscenses: ['', [ Validators.required]],
      Advertising: ['', [ Validators.required]],
      Trash: ['', [ Validators.required]],
      monitoring: ['', [ Validators.required]],
      maintenance: ['', [ Validators.required]],
      Pest: ['', [ Validators.required]],
      Management: ['', [ Validators.required]],
      Other: ['', [ Validators.required]],
      EstimatedClosingCosts: ['', [ Validators.required]],
      RegimeFee: ['', [ Validators.required]],

    });

  }

  confValueSubmit(){
    //console.log(this.confValues.value);
    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.loader = true;
    this.api.update_default_values(this.confValues.value).subscribe((dataResponse) => {
      console.log(dataResponse);
      this.showMsgSuccess = true;
      window.scroll(0,250);
      this.loader = false;
    },
    (error)=>{
      this.showMsgError = true;
      console.log(error);
      this.errormsg = error.message;
      this.loader = false;
    });
  }

}
