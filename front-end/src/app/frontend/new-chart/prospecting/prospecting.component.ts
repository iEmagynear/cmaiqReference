import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ChartService } from "../../../services/chart.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DialogClientComponent } from "./../dialog-client/dialog-client.component";
import { DialogPropertyComponent } from "./../dialog-property/dialog-property.component";
import { MouseEvent } from "@agm/core";
import {
  GoogleMapsAPIWrapper,
  AgmMap,
  LatLngBounds,
  LatLngBoundsLiteral,
} from "@agm/core";
declare var google: any;
import Swal from "sweetalert2";
import { DataService } from "../../../services/data.service";
import { PaymentService } from "../../../services/payment.service";
import { StatusService } from "../../../services/status.service";
import { TimerService } from "../../../services/timer.service";
import { Subject, timer, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-prospecting",
  templateUrl: "./prospecting.component.html",
  styleUrls: ["./prospecting.component.scss"],
  providers: [
    ChartService,
    DataService,
    PaymentService,
    StatusService,
    TimerService,
  ],
})
export class ProspectingComponent implements OnInit {
  addChart;
  showft = true;
  currentId;
  constructor(
    public dialogRef: MatDialogRef<ProspectingComponent>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.currentId = JSON.parse(localStorage.getItem("currentUser"))._id;
    //console.log(this.currentId);
  }

  ngOnInit() {
    this.validateChartForm();
  }
  get f() {
    return this.addChart.controls;
  }

  validateChartForm() {
    this.addChart = this.formBuilder.group({
      chart_title: [""],
      sqr_ft: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(3),
          Validators.maxLength(5),
          Validators.required,
        ],
      ],
    });
    //console.log(this.addChart);
  }
  onGroup(label) {
    //console.log(label);
    this.showft = false;
    this.addChart.controls.sqr_ft.setValue("");
    this.addChart.controls.sqr_ft.setValidators(null);
    this.addChart.controls.sqr_ft.setErrors(null);
    this.addChart.controls.sqr_ft.updateValueAndValidity();
  }

  next() {
    //console.log(this.addChart.controls.sqr_ft.value);
    //localStorage.removeItem('property_id_popup');
    //localStorage.setItem('sqr_ft', this.addChart.controls.sqr_ft.value);
    //localStorage.setItem('chart_title', this.addChart.controls.chart_title.value);
    //console.log("/new-chart/property-value-analysis/prospecting/"+this.addChart.controls.chart_title.value+'/'+this.addChart.controls.sqr_ft.value);
    this.dialogRef.close({
      chart_title: this.addChart.controls.chart_title.value,
      sqr_ft: this.addChart.controls.sqr_ft.value,
    });
    //this.router.navigate(["/new-chart/property-value-analysis/prospecting/"+this.addChart.controls.chart_title.value+'/'+this.addChart.controls.sqr_ft.value]);
  }
}
