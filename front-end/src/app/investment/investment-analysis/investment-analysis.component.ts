import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChartService } from "../../services/chart.service";
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogClientComponent } from '../../frontend/new-chart/dialog-client/dialog-client.component';
import { DialogPropertyComponent } from '../../frontend/new-chart/dialog-property/dialog-property.component'
import { MouseEvent } from '@agm/core';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
declare var google: any;
import Swal from 'sweetalert2'
import { DataService } from "../../services/data.service";
import { PaymentService } from "../../services/payment.service";
import { StatusService } from "../../services/status.service";
import { TimerService } from '../../services/timer.service';
import { Subject, timer, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DialogPropertyPopupComponent } from '../../frontend/new-chart/dialog-property-popup/dialog-property-popup.component';

@Component({
  selector: 'app-investment-analysis',
  templateUrl: './investment-analysis.component.html',
  styleUrls: ['./investment-analysis.component.scss'],
  providers:[ChartService]
})
export class InvestmentAnalysisComponent implements OnInit {
  public selectedImg;
  showft = true;
  public groupName = 'Select property';
  public properties = []
  loader = false;
  addChart;
  public clearSelect = false;
  constructor(public translate: TranslateService,public dialog: MatDialog,private api: ChartService,private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.validateChartForm();
    this.getProperties();
    localStorage.removeItem('investment-analysis');
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('NewCharts.Select Property').subscribe((text: string) => {
      //console.log(text);
      this.groupName = text;
      //this.CreditCardConfirmation = text;
      //console.log(text);
    });
  }

  onGroup(property){
    console.log(property);
    this.groupName = property.address;
    this.addChart.controls.groupName.setValue(this.groupName);
    this.addChart.controls.propertyId.setValue(property);
    this.showft=false;
    this.clearSelect = true;
    this.addChart.controls.chart_title.setValue('');
    this.addChart.controls.chart_title.setValidators(null);
    this.addChart.controls.chart_title.setErrors(null);
    this.addChart.controls.chart_title.updateValueAndValidity();
  }

  validateChartForm() {

    this.addChart = this.formBuilder.group({
      chart_title: ['',[Validators.required]],
      groupName: ['',[Validators.required]],
      propertyId:['',[Validators.required]]

    });
    //console.log(this.addChart);
  }

  enterTitle($event){
    if($event.target.value.trim() != ''){
      this.clearSelect = false;
      this.translate.get('NewCharts.Select Property').subscribe((text: string) => {
        this.groupName = text;
      });

      this.addChart.controls.groupName.setValue('');
      this.addChart.controls.groupName.setValidators(null);
      this.addChart.controls.groupName.setErrors(null);
      this.addChart.controls.groupName.updateValueAndValidity();

      this.addChart.controls.propertyId.setValue('');
      this.addChart.controls.propertyId.setValidators(null);
      this.addChart.controls.propertyId.setErrors(null);
      this.addChart.controls.propertyId.updateValueAndValidity();
    }
  }

  clearPropertType() {
    //console.log('qwdqwd');
    //this.addChart.controls.sqr_ft.setValidators([Validators.pattern("^[0-9]*$"), Validators.minLength(3), Validators.maxLength(5), Validators.required]);
    this.showft = true;
    //this.property_id = '';
    //this.client_id = '';
    //this.groupName = 'Select';
    this.translate.get('NewCharts.Select Property').subscribe((text: string) => {
      //console.log(text);
      this.groupName = text;
      //this.CreditCardConfirmation = text;
      //console.log(text);
    });
    //this.selectedImg = '';
    this.addChart.controls.groupName.setValue('');
    this.addChart.controls.groupName.setValidators([Validators.required]);
    this.addChart.controls.groupName.updateValueAndValidity();

    this.addChart.controls.propertyId.setValue('');
    this.addChart.controls.propertyId.setValidators([Validators.required]);
    this.addChart.controls.propertyId.updateValueAndValidity();

    /* this.addChart.controls.chart_title.setValue(''); */
    this.addChart.controls.chart_title.setValidators([Validators.required]);
    this.addChart.controls.chart_title.updateValueAndValidity();

  }

  getProperties() {
    this.properties = [];
    var properties = [];
    this.loader = true;
    this.api.getPropertyList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
      //const response = dataResponse;
      //console.log(dataResponse);
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
          property_image: (el.property_image) ? el.property_image : '../../../assets/images/services3.png',
          square_footage: el.square_footage,
          state: el.state,
          updated: el.updated,
          zip: el.zip
        });
      });
      this.properties = properties;
      //console.log(this.properties);
      /* if (this.Id) {
        this.get_chart_details(this.Id);
      } */

      this.loader = false;
    },
    error => {
      this.loader = false;
      //this.showMsgError = true;
      console.log(error);
      //this.errormsg = error.message;
    });

  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogPropertyPopupComponent, {
      panelClass: 'property-dialog-container',
      data: {
        action: 'property'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.getProperties();

    });
  }

  addChartSub() {
    console.log(this.addChart.value);
    localStorage.setItem('investment-analysis', JSON.stringify(this.addChart.value));
    this.router.navigate(['analysis']);
  }

}
