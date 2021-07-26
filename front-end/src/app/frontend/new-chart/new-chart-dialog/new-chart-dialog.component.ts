/*import {
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
  selector: "app-new-chart-dialog",
  templateUrl: "./new-chart-dialog.component.html",
  styleUrls: ["./new-chart-dialog.component.scss"],
  providers: [
    ChartService,
    DataService,
    PaymentService,
    StatusService,
    TimerService,
  ],
})

export class NewChartDialogComponent implements OnInit {
  loaderzip = false;
  loadersub = false;
  minutesDisplay = 0;
  secondsDisplay = 0;
  endTime = 1;
  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;
  timeOutExceeded = true;
  initLoadNum = 200;
  lastFilter: string = "";
  lazyLoadNum: number = 200;
  showPolygonButton = true;
  showCircleButton = true;
  resultsCheck = false;
  centerMarker;
  enablepolygon = false;
  enableCircle = false;
  isExtraFields: boolean = false;
  hasRental: boolean = false;
  isCTAR: boolean = false;
  extraFields;
  total_count = 0;
  active_count = 0;
  pending_count = 0;
  cancel_count = 0;
  drawingManager;
  loader = false;
  successmsg;
  addChart;
  public optionSelected;
  public selectedImg;
  public groupName = "Select property";
  public groupNameClient = "Select client";
  public selectPropertyMsg = false;
  clearpolygon = false;
  showpolygon = true;
  clearCircle = false;
  showCircle = true;
  public subDivisions = [];
  public areas = [];
  public zipCode = [];
  public minimumDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  public maximumDate = new Date();
  properties = [];
  property_id;
  mls_name;
  paths = [];
  selected_markers = [];
  selectedMarkers = [];
  // google maps zoom level
  zoom: number = 3;
  mapMarkers: any = [];
  initialPayload = [];
  // initial center position for the map
  lat: number = 39;
  lng: number = -94;
  markers = [];
  mapObj;
  poly;
  circle;
  homes;
  mapCenter;
  addchartformdata;
  addchartpropertyid;
  client_id;
  addchartclientid;
  hasSeven;
  tooBig;
  genChartButtonError = true;
  saveBody;
  max_date;
  currentId;
  public ShowChartBtn = false;
  public clearSelect = true;
  @ViewChild("AgmMap") agmMap: AgmMap;
  Subs: any = [];
  Area: any = [];
  Zips: any = [];
  showft = true;
  PCBORShow = false;
  pcborAreaSelected = false;
  wildcardCheckPass = false;
  Id;
  maxCount = 249;
  currentApi: string;
  lastLength: number;
  myOptions: any[];
  noresultTexts: any;
  myTexts: any;
  loadingTexts: any;
  request: Subscription;
  selectedsub: any;
  selectedarea: any;
  request2: Subscription;
  myOptions2: any;
  lastFilter2: string = "";
  selectedzip: any;
  searcherrordata;
  searcherrornothing;
  searcherrordatahtml;
  searcherrornothinghtml;
  CreateChartError;
  CreateChartErrortext;
  DateRangeError;
  DateRangeErrortext;
  MaximumResultsExceeded;
  MaximumResultsExceededtext;
  es: any;
  redirect = false;
  hideheader: boolean;
  readonly: boolean;
  addProperty;
  states;
  clients = [];
  allProperties: any[];
  addChart;
  showft = true;
  currentId;
  constructor(
    public translate: TranslateService,
    public paymentService: PaymentService,
    public statusService: StatusService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private api: ChartService,
    private dataService: DataService,
    public dialog: MatDialog,
    private router: Router,
    private timerService: TimerService,
    public dialogRefA: MatDialogRef<NewClientComponent>,
    public dialogRefB: MatDialogRef<ProspectingComponent>
  ) {
    this.currentId = JSON.parse(localStorage.getItem("currentUser"))._id;
    //console.log(this.currentId);
  }

  ngOnInit() {
    this.getClients();
    this.getProperties();
    this.validateChartFormA();
    this.validateChartFormB();
  }

  validateChartFormA() {
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
    this.dialogRef.close({
      chart_title: this.addChart.controls.chart_title.value,
      sqr_ft: this.addChart.controls.sqr_ft.value,
    });
    //this.router.navigate(["/new-chart/property-value-analysis/prospecting/"+this.addChart.controls.chart_title.value+'/'+this.addChart.controls.sqr_ft.value]);
  }


  selectClientNew(client) {
    this.client_id = client._id;
    this.addChart.controls.groupNameClient.setValue(client._id);
    this.groupNameClient = client.firstname + " " + client.lastname;
  }

  getStates() {
    this.loader = true;
    this.api.getStateList().subscribe(
      (dataResponse) => {
        const response = dataResponse;
        this.states = response;
        //console.log(response);
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        //this.showMsgError = true;
        console.log(error);
        //this.errormsg = error.message;
      }
    );
  }

  clearClientNew() {
    //this.properties = [];
    this.client_id = "";
    this.addChart.controls.groupNameClient.setValue("");
    //this.groupName = "Select client";
    this.translate
      .get("Property.AddProperty.Select client")
      .subscribe((text: string) => {
        //console.log(text);
        this.groupNameClient = text;
        //this.CreditCardConfirmation = text;
        //console.log(text);
      });
  }

  onGroup(label) {
    //console.log(label);
    this.property_id = label.id;
    //localStorage.setItem('property_id_popup', label._id);
    localStorage.removeItem("sqr_ft");
    localStorage.removeItem("chart_title");
    //this.client_id = label.client;
    this.groupName = label.address;
    //this.groupNameClient = label.client;
    this.selectedImg = label.property_image;
    this.addChart.controls.groupName.setValue(this.groupName);
    //this.addChart.controls.groupNameClient.setValue(this.groupNameClient);
    this.showft = false;
  }

  next() {
    this.loader = true;
    //console.log(this.property_id);
    let response = {
      property_id: this.property_id,
      client_id: this.client_id ? this.client_id : "",
    };
    //console.log(response);

    this.dialogRef.close(response);
    //this.router.navigate(["/new-chart/property-value-analysis/new_client/"+this.property_id]);
    //console.log('in Next');
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate
      .get("NewCharts.Select Property")
      .subscribe((text: string) => {
        //console.log(text);
        this.groupName = text;
        //console.log(text);
      });
  }

  clearPropertType() {
    this.property_id = "";
    this.translate
      .get("NewCharts.Select Property")
      .subscribe((text: string) => {
        //console.log(text);
        this.groupName = text;
        //this.getProperties();
        //this.properties = [];
        //this.CreditCardConfirmation = text;
        //console.log("text");
      });
    this.selectedImg = "";
    this.addChart.controls.groupName.setValue("");
  }

  getProperties(clientId = null, property_id = null) {
    this.properties = [];
    var properties = [];

    let param;
    var $this = this;

    if (clientId) {
    } else {
      this.loader = true;
      param = localStorage.getItem("f_mls");
      //console.log(param);
      this.api.getPropertyList(param).subscribe(
        (dataResponse) => {
          dataResponse.forEach(function (el, idx) {

            properties.push({
              id: el._id,
              address: el.address,
              city: el.city,
              client: el.client,
              created: el.created,
              mls_user_id: el.mls_user_id,
              property_image: el.property_image
                ? el.property_image
                : "../../../assets/images/services1.png",
              square_footage: el.square_footage,
              state: el.state,
              updated: el.updated,
              zip: el.zip,
            });
          });

          this.properties = properties;

          //console.log(this.properties);

          //this.properties = properties;
          this.loader = false;
        },
        (error) => {
          this.loader = false;
          //this.showMsgError = true;
          console.log(error);
          //this.errormsg = error.message;
        }
      );
    }
  }

  get f() {
    return this.addChart.controls;
  }

  validateChartFormB() {
    this.addChart = this.formBuilder.group({
      groupName: ["", [Validators.required]],
      property_type: [""],
      groupNameClient: [""],
      Client_type: [""],
    });
    //console.log(this.addChart);
  }

  openDialog() {
    const dialogReff = this.dialog.open(DialogPropertyPopupComponent, {
      panelClass: "property-dialog-container",
      data: {
        action: "property",
        //client_id:this.client_id
      },
    });

    dialogReff.afterClosed().subscribe((result) => {
      //console.log(result);

      if (result) {
        //var property=[];

        let newProperty = {
          id: result.saved_property._id,
          address: result.saved_property.address,
          city: result.saved_property.city,
          client: result.saved_property.client,
          created: result.saved_property.created,
          mls_user_id: result.saved_property.mls_user_id,
          property_image: result.saved_property.property_image
            ? result.saved_property.property_image
            : "../../../assets/images/services1.png",
          square_footage: result.saved_property.square_footage,
          state: result.saved_property.state,
          updated: result.saved_property.updated,
          zip: result.saved_property.zip,
        };

        this.properties.push(newProperty);

        //console.log(this.properties);

        this.onGroup(newProperty);

        //});


      }
    });
  }


  getClients(newresponse = null) {
    //console.log(newresponse);

    this.loader = true;

    if (newresponse) {
      //console.log(newresponse.saved_client);
      //console.log(this.clients);

      this.clients.unshift(newresponse.saved_client);

      this.client_id = newresponse.saved_client._id;
      this.addChart.controls.groupNameClient.setValue(
        newresponse.saved_client._id
      );
      this.groupNameClient =
        newresponse.saved_client.firstname +
        " " +
        newresponse.saved_client.lastname;
      //console.log(this.clients);
      this.loader = false;
    } else {
      //console.log(localStorage.getItem('f_mls'));
      //if(localStorage.getItem('f_mls') != 'undefined'){
      this.api.getClientList(localStorage.getItem("f_mls")).subscribe(
        (dataResponse) => {
          const response = dataResponse;
          this.clients = response;
          //console.log(response);
          this.loader = false;
        },
        (error) => {
          this.loader = false;
          console.log(error);
        }
      );
    }
  }

  openDialogClient() {
    const dialogRefd = this.dialog.open(DialogClientComponent, {
      panelClass: "client-dialog-container",
      data: {
        action: "client",
      },
    });

    dialogRefd.afterClosed().subscribe((result) => {
      //console.log(result);

      this.getClients(result);
      //this.getProperties()
      //this.properties = [];
      //this.clearPropertType();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    //console.log("destroy");
  }
}*/
