import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { ChartService } from "../../services/chart.service";
import { SharedMlsService } from "../../services/shared-mls.service";
import { ActivatedRoute } from "@angular/router";
import { Chart, ChartDataSets, ChartType, ChartOptions } from "chart.js";
import * as ChartAnnotation from "chartjs-plugin-annotation";
import { Pipe, PipeTransform } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { MouseEvent } from "@agm/core";
import {
  GoogleMapsAPIWrapper,
  AgmMap,
  LatLngBounds,
  LatLngBoundsLiteral,
} from "@agm/core";
declare var google: any;
import Swal from "sweetalert2";
import { Color, BaseChartDirective, Label } from "ng2-charts";
import * as pluginAnnotations from "chartjs-plugin-annotation";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChartjsComponent } from "../chartjs/chartjs.component";
import { SortByPipe } from "../shared/sort.pipe";
import { TranslateService } from "@ngx-translate/core";
import { ConvertPipe } from "./../../pipes/convert.pipe";
import { environment } from "src/environments/environment";
import {
  FacebookService,
  InitParams,
  UIParams,
  UIResponse,
} from "ngx-facebook";

@Component({
  selector: "app-generate-chart",
  templateUrl: "./generate-chart.component.html",
  styleUrls: ["./generate-chart.component.scss"],
  providers: [ChartService, ConvertPipe],
})
@Pipe({
  name: "currencyformat",
})
export class GenerateChartComponent implements OnInit {
  hideSharePopup = true;
  sortByfilter = "days";
  sortreverse = false;
  es: any;
  active_presentation: boolean;
  currentcurrency;
  toggles = {
    active: true,
    underContract: true,
  };
  redirect = false;
  togglesActive = true;
  togglesPending = true;
  samlFlag = false;
  currentdataset = "";
  estimated_home_value;
  centerMarker;
  mapMarkers: any = [];
  mapMarkersReport: any = [];
  mapCenter;
  lat: number = 39;
  lng: number = -94;
  zoom: number = 4;
  latReport: number = 39;
  lngReport: number = -94;
  zoomReport: number = 4;
  mapObj;
  mapObjReport;
  closeResult: string;
  currentId;
  id;
  loader = false;
  chart;
  show = false;
  isSeven = false;
  currentHouse;
  currentHouse2;
  rentalChartDisplay = false;
  landDataCheck = false;
  propLegendCheck = true;
  marketLegendCheck = true;
  emailCopyCheck = false;
  activeCount = 0;
  pendingCount = 0;
  closeCount = 0;
  rateSite;
  rateLayout;
  rateCondition;
  rateQuantity;
  plotResp;
  request;
  monthValue;
  monthValueWhole;
  monthText;
  marketType = "Neutral";
  marketTypeText;
  monthBool = false;
  showoutlier = false;
  suggestedLPText = "X";
  capDOM = "Y";
  capPOS = "Y";
  ConfirmDeleteProperty;
  ConfirmDeletePropertytext1;
  ConfirmDeletePropertytext2;
  searcherrordata;
  searcherrornothing;
  searcherrordatahtml;
  searcherrornothinghtml;
  squarefootage;
  salesprice;
  // Notes Variables
  sale;
  rent;
  Rent;
  Sale;
  rental;
  rental2;
  sales;
  sales2;
  buyer;
  seller;
  tenant;
  landlord;
  buyers;
  sellers;
  tenants;
  landlords;
  closing;
  renting;
  closed;
  sold;
  rented;
  contract;
  lease;
  @ViewChild("AgmMap") agmMap: AgmMap;
  @ViewChild("content") content;
  @ViewChild("email") email;
  @ViewChild("sharepopup") sharepopup;
  @ViewChild("sharepopupbtn") sharepopupbtn;
  @ViewChild(BaseChartDirective) private _chart;
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  showMap = false;
  showMapReport = false;
  houseIcon;
  seasonalityDate;
  emailUser: any;
  public starShow: boolean = true;
  public StarButtonName = "Hide";
  markitArr = [];

  // Main Chart START //
  public scatterChartOptions: ChartOptions = {
    layout: {
      padding: {},
    },
    animation: {},
    scales: {
      yAxes: [
        {
          type: "linear",
          scaleLabel: {
            display: true,
            labelString: "Sales Price",
            fontFamily: "Verdana, Geneva, sans-serif",
          },
          ticks: {
            fontFamily: "Verdana, Geneva, sans-serif",
            autoSkip: true,
            callback: function (value) {
              console.log(value);
              var str = value + "";
              var length = str.length;
              if (length > 6) {
                return (
                  "$" +
                  str.slice(0, -6) +
                  "," +
                  str.slice(-6, -3) +
                  "," +
                  str.slice(-3)
                );
              } else if (length > 3) {
                return "$" + str.slice(0, -3) + "," + str.slice(-3);
              } else {
                return "$" + str;
              }
            },
          },
        },
      ],
      xAxes: [
        {
          type: "linear",
          position: "bottom",
          gridLines: {
            display: false,
          },
          scaleLabel: {
            display: true,
            labelString: "Square Footage",
            fontFamily: "Verdana, Geneva, sans-serif",
          },
          ticks: {
            minRotation: 45,
            autoSkip: true,
            fontFamily: "Verdana, Geneva, sans-serif",
            callback: function (value, index, values) {
              if (Math.floor(value) === value) {
                return value;
              }
            },
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    hover: {
      mode: "point",
    },
    responsive: true,
  };
  public scatterChartData: ChartDataSets[] = [
    {
      label: "Estimated Home Value",
      pointBackgroundColor: "#00ADF9",
      pointBorderWidth: 2,
      pointBorderColor: "#ababab",
      pointHoverRadius: 14,
      showLine: false,
      pointRadius: 10,
      data: [],
    },
    {
      label: "Sold Listing",
      pointBackgroundColor: "#ff2a00",
      pointBorderWidth: 2,
      pointBorderColor: "#ababab",
      pointHoverBorderColor: "#ababab",
      pointHoverBackgroundColor: "#ff2a00",
      pointHoverRadius: 8,
      showLine: false,
      pointRadius: 6,
      data: [],
    },
    {
      label: "Under Contract",
      borderWidth: 3,
      pointBackgroundColor: "#e4e101",
      pointBorderWidth: 2,
      pointBorderColor: "#ababab",
      pointHoverBorderColor: "#ababab",
      pointHoverBackgroundColor: "#e4e101",
      pointHoverRadius: 8,
      showLine: false,
      pointRadius: 6,
      data: [],
    },
    {
      label: "Active Listing",
      pointBackgroundColor: "#00b32a",
      pointBorderWidth: 2,
      pointBorderColor: "#ababab",
      pointHoverBorderColor: "#ababab",
      pointHoverBackgroundColor: "#00b32a",
      pointHoverRadius: 8,
      showLine: false,
      pointRadius: 6,
      data: [],
    },
    {
      label: "2 SD Above Average",
      borderColor: "#d4e3fe",
      backgroundColor: "rgba(212,227,254,.5)",
      borderWidth: 3,
      fill: false,
      showLine: true,
      lineTension: 0.3,
      pointRadius: 0,
      data: [],
    },
    {
      label: "1 SD Above Average",
      borderColor: "#a8c6fe",
      backgroundColor: "rgba(168,198,254,.5)",
      borderWidth: 3,
      pointBackgroundColor: "#a8c6fe",
      pointBorderColor: "#a8c6fe",
      fill: false,
      showLine: true,
      lineTension: 0.3,
      pointRadius: 0,
      data: [],
    },
    {
      label: "Average Home Price",
      borderColor: "#0043aa",
      borderWidth: 3,
      pointBackgroundColor: "#0043aa",
      pointBorderColor: "#0043aa",
      fill: false,
      showLine: true,
      lineTension: 0.3,
      pointRadius: 0,
      data: [],
    },
    {
      label: "1 SD Below Average",
      borderColor: "#a8c6fe",
      borderWidth: 3,
      pointBackgroundColor: "#a8c6fe",
      pointBorderColor: "#a8c6fe",
      fill: false,
      showLine: true,
      lineTension: 0.3,
      pointRadius: 0,
      data: [],
    },
    {
      label: "2 SD Below Average",
      borderColor: "#d4e3fe",
      borderWidth: 3,
      pointBackgroundColor: "#d4e3fe",
      pointBorderColor: "#d4e3fe",
      fill: false,
      showLine: true,
      lineTension: 0.3,
      pointRadius: 0,
      data: [],
    },
  ];
  // Main Chart END //

  hoverIndex = 2;

  public lineChartLabels: Label[] = [];

  // Left Analytics Chart START //
  public lineChartData: ChartDataSets[] = [
    { data: Array<any>(), label: "POS" },
  ];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: this.suggestedLPText,
            fontFamily: "Verdana, Geneva, sans-serif",
          },
        },
      ],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
          scaleLabel: {
            display: true,
            labelString: this.capPOS,
            fontFamily: "Verdana, Geneva, sans-serif",
          },
          ticks: {
            fontFamily: "Verdana, Geneva, sans-serif",
            callback: function (value) {
              var str = value + "";
              var length = str.length;
              if (length > 6) {
                return (
                  str.slice(0, -6) +
                  "," +
                  str.slice(-6, -3) +
                  "," +
                  str.slice(-3) +
                  "%"
                );
              } else if (length > 3) {
                return str.slice(0, -3) + "," + str.slice(-3) + "%";
              } else {
                return str + "%";
              }
            },
          },
        },
      ],
    },
    annotation: {
      annotations: [],
    },
  };
  // Left Analytics Chart END //

  // Right Analytics Chart START //
  public lineChartData2: ChartDataSets[] = [{ data: [], label: "DOM" }];
  public lineChartOptions2: ChartOptions & { annotation: any } = {
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: this.suggestedLPText,
            fontFamily: "Verdana, Geneva, sans-serif",
          },
        },
      ],
      yAxes: [
        {
          id: "y-axis-0",
          position: "right",
          scaleLabel: {
            display: true,
            labelString: this.capDOM,
            fontFamily: "Verdana, Geneva, sans-serif",
          },
          ticks: {
            fontFamily: "Verdana, Geneva, sans-serif",
          },
        },
      ],
    },
    annotation: {
      annotations: [],
    },
  };
  // Right Analytics Chart END //

  public lineChartColors: Color[] = [
    {
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [pluginAnnotations];
  public scatterChartType: ChartType = "line";

  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  innerHeight;
  accessToken;
  showActiveMarker = true;
  showPendingMarker = true;
  showActiveTable: boolean = true;
  showPendingTable: boolean = true;
  minimumDate = new Date();

  message: String = "<data>";

  showDataFromParent = function (data) {
    this.message = data;
    this.deleteFromChart(this.message);
  };
  salesdate: string;
  f_mls: string;
  beachesFlag: boolean;
  requestNew: any;
  socialSubject: string;
  sharedurl: string;
  sharePopupForm: any;
  shareurl: any;
  ShareEndpoint: string;
  clients: any;
  client_id: any;
  selectedClient: any;
  groupNameClient: string = "Select client";

  constructor(
    private fb: FacebookService,
    private converterpipe: ConvertPipe,
    public translate: TranslateService,
    private api: ChartService,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private sortPipe: SortByPipe,
    private sharedMlsService: SharedMlsService
  ) {
    this.accessToken = JSON.parse(localStorage.getItem("currentUser"));
    this.onResize();

    //console.log(window.location.href);
    /* console.log('Initializing Facebook');

    fb.init({
      appId: '1528937850637252',
      version: 'v2.9'
    }); */
  }

  @HostListener("window:resize")
  onResize() {
    if (screen.width < 767) {
      this.innerHeight = window.innerHeight - 200 + "px";
    } else {
      this.innerHeight = window.innerHeight - 135 + "px";
    }
  }

  ngOnInit() {
    this.legendShow();
    this.active_presentation = environment.active_presentation;
    this.houseIcon = new Image();
    this.houseIcon.src = "assets/images/house-icon.png";
    this.houseIcon.alt = "Estimated Home Value";
    this.houseIcon.title = "Estimated Home Value";

    if (localStorage.getItem("samlFlag") === "true") {
      console.log("Saml Login");
      //this.samlFlag = true;
    } else {
      console.log("No SAML");
      this.samlFlag = false;
    }

    this.f_mls = localStorage.getItem("f_mls");

    if (this.f_mls == "5d846e8de3b0d50d6ac919ec") {
      //console.log('in');
      this.beachesFlag = true;
    }

    this.route.params.subscribe((res) => {
      //console.log(res);
      if (res.redirect == "redirectBackToAnalysis") {
        this.redirect = true;
      } else {
        this.client_id = res.redirect;
      }

      if (res.client_id) {
        this.client_id = res.client_id;
      }
      this.currentId = res.id;
      //console.log(this.client_id);
    });

    var fillPlugin = {
      beforeDraw: function (chartInstance, easing) {
        var ctx = chartInstance.chart.ctx;
        var x = chartInstance.scales["x-axis-0"];
        var y = chartInstance.scales["y-axis-0"];
        var datasets = chartInstance.chart.config.data.datasets;

        if (
          chartInstance.config.options.chartArea &&
          chartInstance.config.options.chartArea.backgroundColor
        ) {
          var helpers = Chart.helpers;
          var chartArea = chartInstance.chartArea;

          ctx.save();
          ctx.fillStyle =
            chartInstance.config.options.chartArea.backgroundColor;
          ctx.fillRect(
            chartArea.left,
            chartArea.top,
            chartArea.right - chartArea.left,
            chartArea.bottom - chartArea.top
          );
          ctx.restore();
        }

        ctx.save();
        var dataLength = datasets.length;
        fillBetween(dataLength - 5, dataLength - 1);
        fillBetween(dataLength - 4, dataLength - 2);
        ctx.restore();

        function fillBetween(a, b) {
          if (datasets[a]) {
            var length = datasets[a].data.length;
            datasets[a].data.forEach(function (point, idx) {
              var next = parseInt(idx) + 1;
              //console.log(point);
              if (idx < length - 1) {
                ctx.beginPath();
                ctx.moveTo(
                  x.getPixelForValue(datasets[a].data[idx].x),
                  y.getPixelForValue(datasets[a].data[idx].y)
                );
                ctx.lineTo(
                  x.getPixelForValue(datasets[a].data[next].x),
                  y.getPixelForValue(datasets[a].data[next].y)
                );
                ctx.lineTo(
                  x.getPixelForValue(datasets[b].data[next].x),
                  y.getPixelForValue(datasets[b].data[next].y)
                );
                ctx.lineTo(
                  x.getPixelForValue(datasets[b].data[idx].x),
                  y.getPixelForValue(datasets[b].data[idx].y)
                );
                ctx.closePath();
                ctx.fillStyle = datasets[a].backgroundColor;
                ctx.fill();
              }
            });
          }
        }
      },
    };

    Chart.pluginService.register(fillPlugin);

    this.es = {
      firstDayOfWeek: 0,
      dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "Today",
      clear: "Clear",
    };
    this.getClients();
  }

  validateEmailForm() {
    //console.log("Validate");
    this.emailCopyCheck = false;
    var address = this.chart.targetProperty.address;
    var title = this.chart.chart_title;
    var homeInput = "";
    if (address != "") {
      homeInput = address;
    } else {
      homeInput = title;
    }

    var lower_bound = this.converterpipe.transform(
      this.plotResp.estimated_home_value.sales_price.lower_bound,
      this.currentcurrency,
      "1.0-0"
    );
    var upper_bound = this.converterpipe.transform(
      this.plotResp.estimated_home_value.sales_price.upper_bound,
      this.currentcurrency,
      "1.0-0"
    );
    var email = this.chart.agent.email;
    var phone = this.chart.agent.phone;
    //this.socialSubject = 'CMAIQ Estimated Market Value for ' + homeInput + ".";
    //this.sharedurl = this.router.url.replace(/^\/+/g, '');
    this.emailUser = this.formBuilder.group({
      subject: [
        "cmaIQ Estimated Market Value for " + homeInput + ".",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      email: [
        this.chart.client.email,
        [Validators.maxLength(255), Validators.required],
      ],
      message: [
        "I am pleased to present this home at " +
          lower_bound +
          " - " +
          upper_bound +
          ". Contact me at " +
          email +
          " or " +
          phone +
          " for a showing!",
      ],
    });

    // this.emailUser = this.formBuilder.group({
    //   subject: ['I am pleased to present this home at ' + lower_bound + ' - ' + upper_bound + ". Contact me at " + email + " or " + phone + " for a showing!", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    //   email: [this.chart.client.email, [Validators.maxLength(255), Validators.required]],
    //   message: ['']
    // });
  }

  setEmailCopy() {
    this.emailCopyCheck = !this.emailCopyCheck;
    console.log("Ok: " + this.emailCopyCheck);
  }

  emailUserSubmit() {
    //contact-us
    var cc = "";
    this.loader = true;
    this.showMsgSuccess = false;
    this.showMsgError = false;

    if (this.emailCopyCheck == true) {
      cc = this.chart.agent.email;
    } else {
      cc = "";
    }

    const body = {
      agent_name: this.chart.agent.fullName,
      subject: this.emailUser.value.subject,
      email: this.emailUser.value.email,
      cc: cc,
      message: this.emailUser.value.message,
      url: this.router.url.replace(/^\/+/g, ""),
      link_label: "View Property",
    };

    this.api.sendEmail(body).subscribe(
      (dataResponse) => {
        const response = dataResponse;
        this.showMsgSuccess = true;
        this.loader = false;

        setTimeout(() => {
          this.emailUser.controls.subject.setValue(
            "cmaIQ Estimated Market Value for" +
              this.chart.targetProperty.address +
              "."
          );
          this.emailUser.controls.email.setValue(this.chart.client.email);
          this.emailUser.controls.message.setValue("");
          this.modalService.dismissAll();
        }, 3000);
      },
      (error) => {
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
        this.loader = false;
      }
    );
  }

  onMapReady(map) {
    this.mapObj = map;
  }

  onMapReadyReport(map) {
    this.mapObjReport = map;
  }

  emailButton() {
    this.validateEmailForm();
    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.open(this.email);
  }

  clearEmail() {
    this.emailUser.controls.subject.setValue(
      "cmaIQ Estimated Market Value for" +
        this.chart.targetProperty.address +
        "."
    );
    this.emailUser.controls.email.setValue(this.chart.client.email);
    this.emailUser.controls.message.setValue("");
    this.modalService.dismissAll();
  }

  open(content) {
    console.log(content);

    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", size: "lg" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  zoomChange(event) {
    this.mapCenter = this.mapObj.getCenter();
  }

  photoTooltips(tooltip) {
    // Tooltip Element
    var tooltipEl: any = document.getElementById("chartjs-tooltip");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "chartjs-tooltip";
      tooltipEl.innerHTML = "<table></table>";
      document.body.appendChild(tooltipEl);
    }
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    // Set caret Position
    tooltipEl.classList.remove("above", "below", "no-transform");
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add("no-transform");
    }
    // Set Text
    if (tooltip.body) {
      var title = tooltip.title[0];
      var image = tooltip.title[1]
        ? tooltip.title[1]
        : "assets/images/house-icon.png";
      var bodyLines = tooltip.body[0].lines;
      //PUT CUSTOM HTML TOOLTIP CONTENT HERE (innerHTML)
      var innerHtml = "<thead>";
      innerHtml += "<tr><th>" + title + "</th></tr>";
      innerHtml +=
        '</thead><tbody><tr><td><img src="' + image + '" /></td></tr>';
      bodyLines.forEach(function (line) {
        innerHtml += "<tr><td>" + line + "</td></tr>";
      });
      innerHtml += "</tbody>";
      var tableRoot = tooltipEl.querySelector("table");
      tableRoot.innerHTML = innerHtml;
    }
    var position = {
      bottom: 861,
      height: 712,
      left: 73,
      right: 1213,
      top: 149,
      width: 1140,
      x: 73,
      y: 149,
    };
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;

    //opacity: 0; left: 724px; top: 260px; font-family: undefined; padding: 6px;
    tooltipEl.style.left = position.left + tooltip.caretX + "px";
    tooltipEl.style.top = position.top + tooltip.caretY + "px";
    tooltipEl.style.fontFamily = tooltip._fontFamily;
    tooltipEl.style.fontSize = tooltip.fontSize;
    tooltipEl.style.fontStyle = tooltip._fontStyle;
    tooltipEl.style.padding =
      tooltip.yPadding + "px " + tooltip.xPadding + "px";
  }

  chartHovered($event) {}

  chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);

      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const idx = activePoints[0]._index;
        var datasetIdx = activePoints[0]._datasetIndex;
        // get value by index
        var elId =
          activePoints[0]._chart.config.data.datasets[datasetIdx].data[idx]._id;
        var homeDataArr = this.chart.relatedHomes.filter(function (home) {
          return home._id == elId;
        });
      }

      this.currentHouse = homeDataArr[0];
      if (this.currentHouse) {
        for (var i = 0; i < this.currentHouse.photos.length; i++) {
          if (this.currentHouse.photos[i + 1] === this.currentHouse.photos[i]) {
            this.currentHouse.photos.splice(i + 1, i);
          } else {
          }
        }
      }

      if (homeDataArr.length > 0) {
        this.open(this.content);
      }
    }
  }

  initiateMap() {
    var $this = this;
    this.mapMarkers.forEach(function (el, idx) {
      $this.mapMarkers[idx].setMap(null);
    });

    if (this.chart) {
      this.lat =
        this.chart.mapDetailCenter.lat != undefined &&
        this.chart.mapDetailCenter.lat != 0
          ? this.chart.mapDetailCenter.lat
          : 39;
      this.lng =
        this.chart.mapDetailCenter.lng != undefined &&
        this.chart.mapDetailCenter.lng != 0
          ? this.chart.mapDetailCenter.lng
          : -94;
      this.zoom =
        this.chart.mapDetailCenter.zoom != undefined &&
        this.chart.mapDetailCenter.zoom != 0
          ? this.chart.mapDetailCenter.zoom
          : 5;
      this.mapMarkers = this.createMarkers(this.chart.relatedHomes);
    }
  }

  initiateMapReport() {
    var $this = this;
    this.mapMarkersReport.forEach(function (el, idx) {
      $this.mapMarkersReport[idx].setMap(null);
    });

    this.showMapReport = true;
    if (this.chart) {
      this.latReport =
        this.chart.mapDetailCenter.lat != undefined &&
        this.chart.mapDetailCenter.lat != 0
          ? this.chart.mapDetailCenter.lat
          : 39;
      this.lngReport =
        this.chart.mapDetailCenter.lng != undefined &&
        this.chart.mapDetailCenter.lng != 0
          ? this.chart.mapDetailCenter.lng
          : -94;
      this.zoomReport =
        this.chart.mapDetailCenter.zoom != undefined &&
        this.chart.mapDetailCenter.zoom != 0
          ? this.chart.mapDetailCenter.zoom
          : 5;
      this.mapMarkersReport = this.createMarkersReport(this.chart.relatedHomes);
    }
  }

  mapClicked($event: MouseEvent) {}

  toggleDataset(dataset) {
    //console.log("Dataset: " + dataset);
    this.toggles[dataset] = !this.toggles[dataset];
    this.togglesActive = this.toggles.active;
    this.togglesPending = this.toggles.underContract;
    var dataArray2 = [];
    var plotResp = this.plotResp;

    if (dataset === "active") {
      //console.log("Hide Active")
      this.showActiveMarker = !this.showActiveMarker;
      this.initiateMap();
      this.initiateMapReport();
    }

    if (dataset === "underContract") {
      //console.log("Hide Pending")
      this.showPendingMarker = !this.showPendingMarker;
      this.initiateMap();
      this.initiateMapReport();
    }

    var arr = this.chart.relatedHomes;
    if (this.showMap) {
      for (var i = 0; i < this.mapMarkers.length; i++) {
        this.mapMarkers[i].setMap(null);
      }
      this.mapMarkers = this.createMarkers(arr);
    }

    if (this.showMapReport) {
      for (var i = 0; i < this.mapMarkersReport.length; i++) {
        this.mapMarkersReport[i].setMap(null);
      }
      this.mapMarkersReport = this.createMarkersReport(arr);
    }
  }

  get_chart_details(currentId) {
    let body = {
      id: currentId,
    };

    this.loader = true;
    if (this.requestNew) {
      this.requestNew.unsubscribe();
    }
    // API Call
    this.requestNew = this.api.get_chart_details(body).subscribe(
      (dataResponse) => {
        this.chart = dataResponse.data;
        console.log(this.chart);
        if (this.chart.client.first && !this.client_id) {
          this.groupNameClient =
            this.chart.client.first + " " + this.chart.client.last;
        }
        //this.groupNameClient = client.firstname + " " + client.lastname;
        var address = this.chart.targetProperty.address;
        var title = this.chart.chart_title;
        var homeInput = "";
        if (address != "") {
          homeInput = address;
        } else {
          homeInput = title;
        }
        // this.socialSubject = 'cmaIQ Estimated Market Value for ' + homeInput + ".";
        //console.log(this.router.url);

        this.sharedurl = window.location.href;

        const initParams: InitParams = {
          appId: "1528937850637252",
          xfbml: true,
          version: "v2.8",
        };

        this.fb.init(initParams);

        if (!this.chart.currencyValues) {
          this.api.get_exchange_price().subscribe(
            (dataResponse) => {
              var quotesCheck = dataResponse.currencies;
              //console.log(quotesCheck)
              if (quotesCheck != null) {
                localStorage.setItem("USD", quotesCheck.quotes.USDUSD);
                localStorage.setItem("CAD", quotesCheck.quotes.USDCAD);
                localStorage.setItem("MXN", quotesCheck.quotes.USDMXN);
              } else {
                localStorage.setItem("USD", "1");
                localStorage.setItem("CAD", "1.32239");
                localStorage.setItem("MXN", "18.79079");
              }
            },
            (err) => {
              console.log("ERROR!");
              console.log(err);
            }
          );
        } else {
          var quotes = this.chart.currencyValues;
          localStorage.setItem("USD", quotes.USDUSD);
          localStorage.setItem("CAD", quotes.USDCAD);
          localStorage.setItem("MXN", quotes.USDMXN);
        }

        if (this.chart.relatedProperty.listing_type == "Rental") {
          this.rentalChartDisplay = true;
          //console.log("Rent True")
          this.translate
            .get("Charts.Analytics.APC Probability of Rent Alt")
            .subscribe((text: string) => {
              this.capPOS = text.toUpperCase();
            });
        } else {
          this.rentalChartDisplay = false;
        }

        this.isSeven = this.chart.closedHomes.length <= 3 ? true : false;
        this.sharedMlsService.changeMlsId(
          dataResponse.data.relatedProperty.mls_id
        );
        this.rateSite = this.chart.targetProperty.site;
        this.rateLayout = this.chart.targetProperty.layout;
        this.rateCondition = this.chart.targetProperty.condition;
        this.rateQuantity = this.chart.targetProperty.quality;

        this.seasonalityDate = new Date(this.chart.targetProperty.seasonality);

        var plotResp = JSON.parse(dataResponse.response);
        //console.log(plotResp);
        this.plotResp = plotResp;
        var $this = this;

        var lower_bound = this.converterpipe.transform(
          this.plotResp.estimated_home_value.sales_price.lower_bound,
          this.currentcurrency,
          "1.0-0"
        );
        var upper_bound = this.converterpipe.transform(
          this.plotResp.estimated_home_value.sales_price.upper_bound,
          this.currentcurrency,
          "1.0-0"
        );
        var email = this.chart.agent.email;
        var phone = this.chart.agent.phone;

        //this.socialSubject = 'I am pleased to present this home at ' + lower_bound + ' - ' + upper_bound + ". Contact me at " + email + " or " + phone + " for a showing!";

        var countOutlier =
          this.plotResp.active_outliers.data.length +
          this.plotResp.pending_outliers.data.length +
          this.plotResp.sold_outliers.data.length;
        if (countOutlier > 0) {
          for (
            var i = 0, lenn = this.plotResp.active_outliers.data.length;
            i < lenn;
            i++
          ) {
            var relHome = this.chart.relatedHomes.filter(function (el) {
              return el._id === $this.plotResp.active_outliers.data[i]._id;
            });

            var houseIdx = this.chart.relatedHomes.indexOf(relHome[0]);

            var removePoint = this.chart.activeHomes.filter(function (item) {
              return item.mlsNumber == relHome[0].mlsNumber;
            });

            var closedHouseIdx = this.chart.activeHomes.indexOf(removePoint[0]);
            this.chart.activeHomes.splice(closedHouseIdx, 1);
            this.chart.relatedHomes.splice(houseIdx, 1);
          }

          for (
            var i = 0, lenn = this.plotResp.pending_outliers.data.length;
            i < lenn;
            i++
          ) {
            var relHome = this.chart.relatedHomes.filter(function (el) {
              return el._id === $this.plotResp.pending_outliers.data[i]._id;
            });

            var houseIdx = this.chart.relatedHomes.indexOf(relHome[0]);

            var removePoint = this.chart.pendingHomes.filter(function (item) {
              return item.mlsNumber == relHome[0].mlsNumber;
            });

            var closedHouseIdx = this.chart.pendingHomes.indexOf(
              removePoint[0]
            );
            this.chart.pendingHomes.splice(closedHouseIdx, 1);
            this.chart.relatedHomes.splice(houseIdx, 1);
          }

          for (
            var i = 0, lenn = this.plotResp.sold_outliers.data.length;
            i < lenn;
            i++
          ) {
            var relHome = this.chart.relatedHomes.filter(function (el) {
              return el._id === $this.plotResp.sold_outliers.data[i]._id;
            });

            var houseIdx = this.chart.relatedHomes.indexOf(relHome[0]);

            var removePoint = this.chart.closedHomes.filter(function (item) {
              return item.mlsNumber == relHome[0].mlsNumber;
            });

            var closedHouseIdx = this.chart.closedHomes.indexOf(removePoint[0]);
            this.chart.closedHomes.splice(closedHouseIdx, 1);
            this.chart.relatedHomes.splice(houseIdx, 1);
          }
        }

        //console.log(this.plotResp);

        let currencyPipe: CurrencyPipe = new CurrencyPipe("en-US");
        var arr = [];
        var arr2 = [];
        this.lineChartLabels = [];
        this.lineChartData = [
          {
            label: "POS",
            borderColor: "#1E5BD3",
            backgroundColor: "#1E5BD3",
            borderWidth: 2,
            pointBackgroundColor: "#1E5BD3",
            pointBorderColor: "#1E5BD3",
            fill: false,
          },
        ];

        this.lineChartData2 = [
          {
            label: "POS",
            borderColor: "#1E5BD3",
            backgroundColor: "#1E5BD3",
            borderWidth: 2,
            pointBackgroundColor: "#1E5BD3",
            pointBorderColor: "#1E5BD3",
            fill: false,
          },
        ];
        for (
          var i = 0,
            lenn =
              this.plotResp.estimated_home_value.probability_of_sale_table
                .length;
          i < lenn;
          i++
        ) {
          var probability_of_sale =
            this.plotResp.estimated_home_value.probability_of_sale_table[i]
              .probability_of_sale;
          arr.push(probability_of_sale.toFixed(2));
          var days_on_market =
            this.plotResp.estimated_home_value.probability_of_sale_table[i]
              .days_on_market;
          arr2.push(days_on_market.toFixed(0));
          this.lineChartLabels.push(
            this.converterpipe.transform(
              this.plotResp.estimated_home_value.probability_of_sale_table[i]
                .list_price,
              this.currentcurrency,
              "1.0-0"
            )
          );
        }

        this.lineChartData.push({
          label: "POS",
          data: arr,
          borderColor: "#1E5BD3",
          backgroundColor: "#1E5BD3",
          borderWidth: 2,
          pointBackgroundColor: "#1E5BD3",
          pointBorderColor: "#1E5BD3",
          fill: false,
        });

        this.lineChartData2.push({
          label: "DOM",
          data: arr2,
          borderColor: "#1E5BD3",
          backgroundColor: "#1E5BD3",
          borderWidth: 2,
          pointBackgroundColor: "#1E5BD3",
          pointBorderColor: "#1E5BD3",
          fill: false,
        });

        //console.log(this.lineChartData2);

        var _this = this;

        this.lineChartOptions.hover = {
          onHover: function (evt, item) {
            if (item.length) {
              //console.log(item[0]['_index']);
              _this.hoverIndex = item[0]["_index"];
            }
          },
        };

        this.lineChartOptions2.hover = {
          onHover: function (evt, item) {
            if (item.length) {
              _this.hoverIndex = item[0]["_index"];
            }
          },
        };

        this.charts.forEach((child) => {
          child.update();
        });

        this.activeCount = this.plotResp.active_listing
          ? this.plotResp.active_listing.data.length
          : 0;
        this.pendingCount = this.plotResp.under_contract
          ? this.plotResp.under_contract.data.length
          : 0;
        this.closeCount = this.plotResp.sold_listing
          ? this.plotResp.sold_listing.data.length
          : 0;

        var dataArray2 = [];
        this.estimated_home_value = plotResp.estimated_home_value;

        var nameArr =
          this.estimated_home_value.projected_date_of_sale.split(" ");

        this.translate
          .get("NewCharts." + nameArr[0])
          .subscribe((text: string) => {
            this.estimated_home_value.projected_date_of_sale = text;
          });

        this.estimated_home_value.projected_date_of_sale =
          this.estimated_home_value.projected_date_of_sale + " " + nameArr[1];

        this.monthValue =
          this.estimated_home_value.months_of_inventory.toFixed(1);
        this.monthValueWhole = Math.round(this.monthValue);
        if (this.chart.relatedProperty.listing_type == "Rental") {
          if (this.monthValue < 2.5) {
            this.monthText =
              "<span class='font-bold'>strong landlords’s market</span> in which demand far exceeds supply and favors the landlord in price negotiations.";
            this.monthBool = true;
            this.marketType = "Strong Landlords";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (2.5 <= this.monthValue && this.monthValue < 4.5) {
            this.monthText =
              "<span class='font-bold'>landlords’s market</span> in which demand exceeds supply and slightly favors the landlord in price negotiations.";
            this.monthBool = true;
            this.marketType = "Landlords";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (4.5 <= this.monthValue && this.monthValue < 7.5) {
            this.monthText =
              "<span class='font-bold'>neutral market</span> in which supply and demand are in balance and neither party has a significant advantage in negotiations.";
            this.monthBool = true;
            this.marketType = "Neutral";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (7.5 <= this.monthValue && this.monthValue < 9.5) {
            this.monthText =
              "<span class='font-bold'>tenant’s market</span> in which supply exceeds demand and slightly favors the tenant in price negotiations.";
            this.monthBool = false;
            this.marketType = "Tenants";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (9.5 <= this.monthValue) {
            this.monthText =
              "<span class='font-bold'>strong tenant’s market</span>  in which supply far exceeds demand and favors the tenant in price negotiations.";
            this.monthBool = false;
            this.marketType = "Strong Tenants";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          }
        } else {
          if (this.monthValue < 2.5) {
            this.monthText =
              "<span class='font-bold'>strong seller’s market</span> in which demand far exceeds supply and favors the seller in price negotiations.";
            this.monthBool = true;
            this.marketType = "Strong Sellers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (2.5 <= this.monthValue && this.monthValue < 4.5) {
            this.monthText =
              "<span class='font-bold'>seller’s market</span> in which demand exceeds supply and slightly favors the seller in price negotiations.";
            this.monthBool = true;
            this.marketType = "Sellers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (4.5 <= this.monthValue && this.monthValue < 7.5) {
            this.monthText =
              "<span class='font-bold'>neutral market</span> in which supply and demand are in balance and neither party has a significant advantage in negotiations.";
            this.monthBool = true;
            this.marketType = "Neutral";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (7.5 <= this.monthValue && this.monthValue < 9.5) {
            this.monthText =
              "<span class='font-bold'>buyer’s market</span> in which supply exceeds demand and slightly favors the buyer in price negotiations.";
            this.monthBool = false;
            this.marketType = "Buyers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (9.5 <= this.monthValue) {
            this.monthText =
              "<span class='font-bold'>strong buyer’s market</span>  in which supply far exceeds demand and favors the buyer in price negotiations.";
            this.monthBool = false;
            this.marketType = "Strong Buyers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          }
        }

        for (var i = 0, len = this.scatterChartData.length; i < len; i++) {
          //console.log(this.scatterChartData[i].label);
          if (this.scatterChartData[i].label == "Estimated Home Value") {
            //console.log(plotResp.estimated_home_value.area);
            //console.log(plotResp.estimated_home_value.sales_price.estimate);
            dataArray2.push([
              {
                x: plotResp.estimated_home_value.area,
                y: plotResp.estimated_home_value.sales_price.estimate,
              },
            ]);
            //this.lineChartLabels
          }
          if (this.scatterChartData[i].label == "Sold Listing") {
            //console.log(plotResp.sold_listing.data);
            dataArray2.push(plotResp.sold_listing.data);
          }
          if (this.scatterChartData[i].label == "Under Contract") {
            //this.scatterChartData[i].data = plotResp.under_contract.data
            dataArray2.push(plotResp.under_contract.data);
          }
          if (this.scatterChartData[i].label == "Active Listing") {
            //this.scatterChartData[i].data = plotResp.active_listing.data
            dataArray2.push(plotResp.active_listing.data);
          }
          if (this.scatterChartData[i].label == "2 SD Above Average") {
            //console.log(plotResp["2_sd_above_average"].data);
            //this.scatterChartData[i].data = plotResp["2_sd_above_average"].data
            dataArray2.push(plotResp["2_sd_above_average"].data);
          }
          if (this.scatterChartData[i].label == "1 SD Below Average") {
            //this.scatterChartData[i].data = plotResp["1_sd_below_average"].data
            dataArray2.push(plotResp["1_sd_below_average"].data);
          }
          if (this.scatterChartData[i].label == "Average Home Price") {
            //this.scatterChartData[i].data = plotResp["average_home_price"].data
            dataArray2.push(plotResp.average_home_price.data);
          }
          if (this.scatterChartData[i].label == "1 SD Above Average") {
            //this.scatterChartData[i].data = plotResp["1_sd_above_average"].data
            dataArray2.push(plotResp["1_sd_above_average"].data);
          }
          if (this.scatterChartData[i].label == "2 SD Below Average") {
            //this.scatterChartData[i].data = plotResp["2_sd_below_average"].data
            dataArray2.push(plotResp["2_sd_below_average"].data);
          }
        }

        this.scatterChartData[0].pointStyle = this.houseIcon;

        for (var i = 0, len = this.scatterChartData.length; i < len; i++) {
          this.scatterChartData[i].data = dataArray2[i];
        }

        this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString =
          this.capPOS;
        this.lineChartOptions2.scales.yAxes[0].scaleLabel.labelString =
          this.capDOM;

        this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString =
          this.suggestedLPText;
        this.lineChartOptions2.scales.xAxes[0].scaleLabel.labelString =
          this.suggestedLPText;

        this.scatterChartOptions.scales.xAxes[0].ticks.min =
          plotResp.estimated_home_value.xrange.x_min_tick;
        this.scatterChartOptions.scales.xAxes[0].ticks.max =
          plotResp.estimated_home_value.xrange.x_max_tick;
        this.scatterChartOptions.scales.yAxes[0].ticks.min =
          plotResp.estimated_home_value.yrange.y_min_tick;
        this.scatterChartOptions.scales.yAxes[0].ticks.max =
          plotResp.estimated_home_value.yrange.y_max_tick;

        if (this.rentalChartDisplay === true) {
          //console.log("Rental Switch");
          this.scatterChartOptions.scales.yAxes[0].scaleLabel.labelString =
            "Rental Price";
        } else if (this.landDataCheck === true) {
          //console.log("Land Check")
          this.scatterChartOptions.scales.xAxes[0].scaleLabel.labelString =
            "Acreage";
        } else {
          this.scatterChartOptions.scales.yAxes[0].scaleLabel.labelString =
            "Sales Price";
        }

        var chart = this.chart;
        this.scatterChartOptions.tooltips = {
          enabled: false,
          mode: "point",
          position: "nearest",
          custom: this.photoTooltips,
          callbacks: {
            title: function (tooltipItems, data) {
              //console.log("TIPS", tooltipItems);
              const idx = tooltipItems[0].index;
              //console.log("idx",idx)
              var datasetIdx = tooltipItems[0].datasetIndex;
              //console.log("datasetIdx",datasetIdx)
              var elId = data.datasets[datasetIdx].data[idx]["_id"];

              if (tooltipItems[0].datasetIndex === 0) {
                return [
                  chart.targetProperty.address,
                  chart.targetProperty.image,
                ];
              }

              var homeDataArr = chart.relatedHomes.filter(function (home) {
                //console.log(home._id);
                return home._id == elId;
              });
              //console.log(homeDataArr[0]);
              return [homeDataArr[0].address, homeDataArr[0].photos[0]];
            },
            label: function (tooltipItem, data) {
              //console.log(tooltipItem);
              var sqFt = tooltipItem.xLabel;
              var sqFtLabel = "Square Footage: " + sqFt;

              var price = tooltipItem.yLabel;
              var priceLabel;
              let currencyPipe: CurrencyPipe = new CurrencyPipe("en-US");
              if (tooltipItem.datasetIndex === 0) {
                let newValue: string = currencyPipe.transform(
                  price,
                  "USD",
                  "symbol",
                  "1.0-2"
                );
                priceLabel = "Estimated Value: " + newValue;
              } else {
                let newValue: string = currencyPipe.transform(
                  price,
                  "USD",
                  "symbol",
                  "1.0-2"
                );
                priceLabel = "Sales Price: " + newValue;
              }

              return [sqFtLabel, priceLabel];
            },
          },
        };

        this.show = true;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        Swal.fire({
          title: this.searcherrordata,
          html: this.searcherrordatahtml,
          width: "42em",
        });
      }
    );
  }

  createMarkers(arr) {
    // console.log(arr);

    var bounds = new google.maps.LatLngBounds();
    var markitArr = [];
    this.markitArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].lat === null || arr[i].long === null) {
      } else {
        var latlng = new google.maps.LatLng(
          parseFloat(arr[i].lat),
          parseFloat(arr[i].long)
        );

        if (arr[i].status === "Active") {
          // Create Active Marker
          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObj,
            listingId: arr[i].mlsNumber,
            status: arr[i].status,
            opacity: this.showActiveMarker ? 1 : 0,
            icon: "assets/images/darkgreen_MarkerO.png",
          });

          this.createMarkerTooltip(marker);
        } else if (arr[i].status === "Closed" || arr[i].status === "Sold") {
          // Create Closed Marker
          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObj,
            listingId: arr[i].mlsNumber,
            status: arr[i].status,
            icon: "assets/images/red_MarkerO.png",
          });

          this.createMarkerTooltip(marker);
        } else {
          // Create Pending Marker
          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObj,
            listingId: arr[i].mlsNumber,
            status: arr[i].status,
            opacity: this.showPendingMarker ? 1 : 0,
            icon: "assets/images/yellow_MarkerO.png",
          });

          this.createMarkerTooltip(marker);
        }

        bounds.extend(marker.position);

        markitArr.push(marker);
        this.markitArr.push(marker);
      }
    }
    this.centerMarker = bounds;

    //console.log(this.centerMarker);
    var $this = this;
    //userCenterMarker.setMap(map);
    //this.mapObj.fitBounds(bounds);
    setTimeout(function () {
      $this.mapObj.fitBounds(bounds);
      $this.mapObj.panToBounds(bounds);
    }, 1000);

    /*  var listener = google.maps.event.addListener(this.mapObj, "idle", function() {
       google.maps.event.removeListener(listener);
       console.log(this.getZoom());

     }); */

    return markitArr;
  }

  createMarkerTooltip(marker) {
    var contentString = "Content";
    contentString = this.infoWindowGenerate(marker.listingId);
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      disableAutoPan: false,
    });
    var $this = this;
    marker.addListener("click", function (e) {
      $this.mapClick(marker.listingId);
    });

    marker.addListener("mouseover", function (e) {
      infowindow.open(this.mapObj, marker);
    });

    marker.addListener("mouseout", function (e) {
      setTimeout(infowindow.close(this.mapObj, marker), 250);
    });
  }

  createMarkersReport(arr) {
    //console.log(arr);

    var bounds = new google.maps.LatLngBounds();
    var markitArr = [];
    for (var i = 0; i < arr.length; i++) {
      var contentString = "Content";

      if (arr[i].lat === null || arr[i].long === null) {
      } else {
        var latlng = new google.maps.LatLng(
          parseFloat(arr[i].lat),
          parseFloat(arr[i].long)
        );

        if (arr[i].status === "Active") {
          // Create Active Marker
          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObjReport,
            listingId: arr[i].mlsNumber,
            status: arr[i].status,
            opacity: this.showActiveMarker ? 1 : 0,
            icon: "assets/images/darkgreen_MarkerO.png",
          });
        } else if (arr[i].status === "Closed" || arr[i].status === "Sold") {
          // Create Closed Marker
          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObjReport,
            listingId: arr[i].mlsNumber,
            status: arr[i].status,
            icon: "assets/images/red_MarkerO.png",
          });
        } else {
          // Create Pending Marker
          var marker = new google.maps.Marker({
            position: latlng,
            map: this.mapObjReport,
            listingId: arr[i].mlsNumber,
            status: arr[i].status,
            opacity: this.showPendingMarker ? 1 : 0,
            icon: "assets/images/yellow_MarkerO.png",
          });
        }

        bounds.extend(marker.position);

        markitArr.push(marker);
      }
    }
    this.centerMarker = bounds;

    var $this = this;
    setTimeout(function () {
      $this.mapObjReport.fitBounds(bounds);
      $this.mapObjReport.panToBounds(bounds);
    }, 1000);

    return markitArr;
  }

  mapClick(listingId) {
    var clickedHome = listingId;
    var homeDataArr = this.chart.relatedHomes.filter(function (home) {
      return home.mlsNumber == clickedHome;
    });
    this.currentHouse = homeDataArr[0];
    if (homeDataArr.length > 0) {
      this.open(this.content);
    } else {
    }
  }

  showImages(listingId, status) {
    var clickedHome = listingId;
    var homeDataArr = this.chart.relatedHomes.filter(function (home) {
      return home.mlsNumber == clickedHome && home.status == status;
    });
    this.currentHouse = homeDataArr[0];
    if (homeDataArr.length > 0) {
      this.open(this.content);
    } else {
    }
  }

  infoWindowGenerate(listingId) {
    var hoveredHome = listingId;
    var homeDataArr = this.chart.relatedHomes.filter(function (home) {
      return home.mlsNumber == hoveredHome;
    });
    this.currentHouse2 = homeDataArr[0];

    for (var i = 0; i < this.currentHouse2.photos.length; i++) {
      if (this.currentHouse2.photos[i + 1] === this.currentHouse2.photos[i]) {
        this.currentHouse2.photos.splice(i + 1, i);
      } else {
      }
    }
    var currentHousePrice = this.currentHouse2.price;

    var currentHouseSqFt = this.currentHouse2.squareFootage
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var contentString = "";

    if (this.chart.targetProperty.category === "rental") {
      contentString =
        '<div id="content">' +
        '<h5 class="mapDetail-text-head">' +
        this.currentHouse2.address +
        "</h5>" +
        "<div>" +
        '<img src="' +
        this.currentHouse2.photos[0] +
        '" class="mapDetail-image" >' +
        '<div class="mapDetail-text-body"> <p>' +
        this.squarefootage +
        ": " +
        currentHouseSqFt +
        "</p></div>" +
        '<div class="mapDetail-text-body"><p> Rental Price: ' +
        this.converterpipe.transform(
          currentHousePrice,
          this.currentcurrency,
          "1.0-0"
        ) +
        "</p></div>" +
        "</div>" +
        "</div>";
    } else {
      contentString =
        '<div id="content">' +
        '<h5 class="mapDetail-text-head">' +
        this.currentHouse2.address +
        "</h5>" +
        "<div>" +
        '<img src="' +
        this.currentHouse2.photos[0] +
        '" class="mapDetail-image" >' +
        '<div class="mapDetail-text-body"><p> ' +
        this.squarefootage +
        ": " +
        currentHouseSqFt +
        "</p></div>" +
        '<div class="mapDetail-text-body"><p> ' +
        this.salesprice +
        ": " +
        this.converterpipe.transform(
          currentHousePrice,
          this.currentcurrency,
          "1.0-0"
        ) +
        "</p></div>" +
        "</div>" +
        "</div>";
    }

    return contentString;
  }

  starRatingSite(rate) {
    this.rateSite = rate;
    this.chart.targetProperty.site = this.rateSite;
    this.regenrateChart();
  }

  starRatingLayout(rate) {
    this.rateLayout = rate;
    this.chart.targetProperty.layout = this.rateLayout;
    this.regenrateChart();
  }

  starRatingCondition(rate) {
    this.rateCondition = rate;
    this.chart.targetProperty.condition = this.rateCondition;
    this.regenrateChart();
  }

  starRatingQuantity(rate) {
    this.rateQuantity = rate;
    this.chart.targetProperty.quality = this.rateQuantity;
    this.regenrateChart();
  }

  changeSquareft(squareFootage) {
    if (isNaN(squareFootage)) {
      console.log("error1");
    } else if (squareFootage < 0 || squareFootage == "") {
      console.log("error2");
      this.chart.targetProperty.squareFootage = 0;
      this.regenrateChart();
    } else {
      this.chart.targetProperty.squareFootage = squareFootage;
      this.regenrateChart();
    }
  }

  changeSeasonality($event) {
    this.chart.targetProperty.seasonality = new Date($event);
    this.regenrateChart();
  }

  regenrateChart() {
    this.loader = true;
    if (this.request) {
      this.request.unsubscribe();
    }

    this.request = this.api.editChartResponse(this.chart).subscribe(
      (dataResponse) => {
        //console.log(dataResponse);

        this.isSeven = this.chart.closedHomes.length <= 3 ? true : false;
        this.rateSite = this.chart.targetProperty.site;
        this.rateLayout = this.chart.targetProperty.layout;
        this.rateCondition = this.chart.targetProperty.condition;
        this.rateQuantity = this.chart.targetProperty.quality;

        var plotResp = JSON.parse(dataResponse.response);
        this.plotResp = plotResp;
        this.estimated_home_value = plotResp.estimated_home_value;
        //console.dir("3: " + this.estimated_home_value);

        this.monthValue =
          this.estimated_home_value.months_of_inventory.toFixed(1);
        this.monthValueWhole = Math.round(this.monthValue);

        if (this.chart.relatedProperty.listing_type == "Rental") {
          if (this.monthValue < 2.5) {
            this.monthText =
              "<span class='font-bold'>strong landlords’s market</span> in which demand far exceeds supply and favors the landlord in price negotiations.";
            this.monthBool = true;
            this.marketType = "Strong Landlords";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (2.5 <= this.monthValue && this.monthValue < 4.5) {
            this.monthText =
              "<span class='font-bold'>landlords’s market</span> in which demand exceeds supply and slightly favors the landlord in price negotiations.";
            this.monthBool = true;
            this.marketType = "Landlords";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (4.5 <= this.monthValue && this.monthValue < 7.5) {
            this.monthText =
              "<span class='font-bold'>neutral market</span> in which supply and demand are in balance and neither party has a significant advantage in negotiations.";
            this.monthBool = true;
            this.marketType = "Neutral";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (7.5 <= this.monthValue && this.monthValue < 9.5) {
            this.monthText =
              "<span class='font-bold'>tenant’s market</span> in which supply exceeds demand and slightly favors the tenant in price negotiations.";
            this.monthBool = false;
            this.marketType = "Tenants";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (9.5 <= this.monthValue) {
            this.monthText =
              "<span class='font-bold'>strong tenant’s market</span>  in which supply far exceeds demand and favors the tenant in price negotiations.";
            this.monthBool = false;
            this.marketType = "Strong Tenants";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          }
        } else {
          if (this.monthValue < 2.5) {
            this.monthText =
              "<span class='font-bold'>strong seller’s market</span> in which demand far exceeds supply and favors the seller in price negotiations.";
            this.monthBool = true;
            this.marketType = "Strong Sellers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (2.5 <= this.monthValue && this.monthValue < 4.5) {
            this.monthText =
              "<span class='font-bold'>seller’s market</span> in which demand exceeds supply and slightly favors the seller in price negotiations.";
            this.monthBool = true;
            this.marketType = "Sellers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (4.5 <= this.monthValue && this.monthValue < 7.5) {
            this.monthText =
              "<span class='font-bold'>neutral market</span> in which supply and demand are in balance and neither party has a significant advantage in negotiations.";
            this.monthBool = true;
            this.marketType = "Neutral";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (7.5 <= this.monthValue && this.monthValue < 9.5) {
            this.monthText =
              "<span class='font-bold'>buyer’s market</span> in which supply exceeds demand and slightly favors the buyer in price negotiations.";
            this.monthBool = false;
            this.marketType = "Buyers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          } else if (9.5 <= this.monthValue) {
            this.monthText =
              "<span class='font-bold'>strong buyer’s market</span>  in which supply far exceeds demand and favors the buyer in price negotiations.";
            this.monthBool = false;
            this.marketType = "Strong Buyers";
            this.translate
              .get("Charts.Market Type." + this.marketType)
              .subscribe((text: string) => {
                this.marketTypeText = text;
              });
          }
        }
        //console.log(this.plotResp);
        let currencyPipe: CurrencyPipe = new CurrencyPipe("en-US");
        var arr = [];
        var arr2 = [];
        this.lineChartLabels = [];

        var $this = this;
        var outlierText = "";
        var countOutlier =
          this.plotResp.active_outliers.data.length +
          this.plotResp.pending_outliers.data.length +
          this.plotResp.sold_outliers.data.length;

        if (countOutlier > 0) {
          for (
            var i = 0, lenn = this.plotResp.active_outliers.data.length;
            i < lenn;
            i++
          ) {
            var relHome = this.chart.relatedHomes.filter(function (el) {
              return el._id === $this.plotResp.active_outliers.data[i]._id;
            });
            console.log("relHome -");
            console.log(relHome[0]);

            var houseIdx = this.chart.relatedHomes.indexOf(relHome[0]);
            outlierText += relHome[0].address + " ,";
            //console.log(relHome[0].mlsNumber);

            var removePoint = this.chart.activeHomes.filter(function (item) {
              //console.log($this.plotResp.outliers.data[i]._id);
              return item.mlsNumber == relHome[0].mlsNumber;
            });

            console.log("removePoint -");
            console.log(removePoint[0]);

            var closedHouseIdx = this.chart.activeHomes.indexOf(removePoint[0]);
            this.chart.activeHomes.splice(closedHouseIdx, 1);
            this.chart.relatedHomes.splice(houseIdx, 1);
          }

          for (
            var i = 0, lenn = this.plotResp.pending_outliers.data.length;
            i < lenn;
            i++
          ) {
            //console.log($this.plotResp.outliers.data[i]._id);
            var relHome = this.chart.relatedHomes.filter(function (el) {
              return el._id === $this.plotResp.pending_outliers.data[i]._id;
            });

            var houseIdx = this.chart.relatedHomes.indexOf(relHome[0]);
            outlierText += relHome[0].address + " ,";

            var removePoint = this.chart.pendingHomes.filter(function (item) {
              //console.log($this.plotResp.outliers.data[i]._id);
              return item.mlsNumber == relHome[0].mlsNumber;
            });

            var closedHouseIdx = this.chart.pendingHomes.indexOf(
              removePoint[0]
            );
            this.chart.pendingHomes.splice(closedHouseIdx, 1);
            this.chart.relatedHomes.splice(houseIdx, 1);
          }

          for (
            var i = 0, lenn = this.plotResp.sold_outliers.data.length;
            i < lenn;
            i++
          ) {
            //console.log($this.plotResp.outliers.data[i]._id);
            var relHome = this.chart.relatedHomes.filter(function (el) {
              return el._id === $this.plotResp.sold_outliers.data[i]._id;
            });
            var houseIdx = this.chart.relatedHomes.indexOf(relHome[0]);
            outlierText += relHome[0].address + " ,";

            var removePoint = this.chart.closedHomes.filter(function (item) {
              //console.log($this.plotResp.outliers.data[i]._id);
              return item.mlsNumber == relHome[0].mlsNumber;
            });

            var closedHouseIdx = this.chart.closedHomes.indexOf(removePoint[0]);
            this.chart.closedHomes.splice(closedHouseIdx, 1);
            this.chart.relatedHomes.splice(houseIdx, 1);
          }
          outlierText = outlierText.slice(0, -1);
        }

        var nameArr =
          this.estimated_home_value.projected_date_of_sale.split(" ");

        this.translate
          .get("NewCharts." + nameArr[0])
          .subscribe((text: string) => {
            this.estimated_home_value.projected_date_of_sale = text;
          });

        this.estimated_home_value.projected_date_of_sale =
          this.estimated_home_value.projected_date_of_sale + " " + nameArr[1];

        for (
          var i = 0,
            lenn =
              this.plotResp.estimated_home_value.probability_of_sale_table
                .length;
          i < lenn;
          i++
        ) {
          //console.log(this.plotResp.estimated_home_value.probability_of_sale_table[i]);
          //console.log(this.lineChartData[0].data)
          var probability_of_sale =
            this.plotResp.estimated_home_value.probability_of_sale_table[i]
              .probability_of_sale;
          arr.push(probability_of_sale.toFixed(2));
          var days_on_market =
            this.plotResp.estimated_home_value.probability_of_sale_table[i]
              .days_on_market;
          arr2.push(days_on_market.toFixed(0));
          this.lineChartLabels.push(
            this.converterpipe.transform(
              this.plotResp.estimated_home_value.probability_of_sale_table[i]
                .list_price,
              this.currentcurrency,
              "1.0-0"
            )
          );
        }

        this.lineChartData[1].data = arr;

        this.lineChartData2[1].data = arr2;

        var _this = this;

        this.lineChartOptions.hover = {
          onHover: function (evt, item) {
            if (item.length) {
              _this.hoverIndex = item[0]["_index"];
            }
          },
        };

        this.lineChartOptions2.hover = {
          onHover: function (evt, item) {
            if (item.length) {
              _this.hoverIndex = item[0]["_index"];
            }
          },
        };

        this.charts.forEach((child) => {
          child.update();
        });

        this.activeCount = this.plotResp.active_listing
          ? this.plotResp.active_listing.data.length
          : 0;
        this.pendingCount = this.plotResp.under_contract
          ? this.plotResp.under_contract.data.length
          : 0;
        this.closeCount = this.plotResp.sold_listing
          ? this.plotResp.sold_listing.data.length
          : 0;

        if (this.chart.targetProperty.category === "rental") {
          this.rentalChartDisplay = true;
        }
        this.initiateMap();
        this.initiateMapReport();
        this.show = true;
        window.scroll(200, 300);
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        console.log(error);
        Swal.fire({
          title: this.searcherrordata,
          html: this.searcherrordatahtml,
          footer: error.response,
          width: "42em",
        });
      }
    );
  }

  printButton() {
    window.print();
  }

  showMessageFromCur(message) {
    this.currentcurrency = message;
    //console.log("Currency: " + this.currentcurrency);
    this.get_chart_details(this.currentId);
    this.initiateMap();
    this.initiateMapReport();
  }

  showMessageFromChild(message: any) {
    //console.log("Language: " + message);

    this.translate
      .get("NewCharts.Search Error (Data)")
      .subscribe((text: string) => {
        this.searcherrordata = text;
      });

    this.translate
      .get("NewCharts.Search Error (Nothing found)")
      .subscribe((text: string) => {
        this.searcherrornothing = text;
      });

    this.translate.get("NewCharts.errortext").subscribe((text: string) => {
      this.searcherrordatahtml = text;
    });

    this.translate
      .get("NewCharts.errortextnothing")
      .subscribe((text: string) => {
        this.searcherrornothinghtml = text;
      });

    this.translate
      .get("Sign Out.Confirm Delete Property")
      .subscribe((text: string) => {
        //;
        this.ConfirmDeleteProperty = text;
        //;
      });

    this.translate
      .get("Sign Out.Confirm Delete Propertytext1")
      .subscribe((text: string) => {
        //;
        this.ConfirmDeletePropertytext1 = text;
        //;
      });

    this.translate
      .get("Sign Out.Confirm Delete Propertytext2")
      .subscribe((text: string) => {
        //;
        this.ConfirmDeletePropertytext2 = text;
        //;
      });

    this.translate.get("NewCharts.months").subscribe((text: string) => {
      //;
      var nameArr = text.split(",");
      //console.log(nameArr);
      this.es.monthNames = nameArr;
    });

    this.translate
      .get("Charts.Chart.Sales Price")
      .subscribe((text1: string) => {
        this.salesprice = text1;
      });

    this.translate.get("Charts.Chart.Sales Date").subscribe((text: string) => {
      this.salesdate = text;
    });

    this.translate
      .get("Charts.Chart.Square Footage")
      .subscribe((text: string) => {
        this.squarefootage = text;
      });

    this.translate
      .get("Charts.Analytics.APC Suggested List Price")
      .subscribe((text: string) => {
        this.suggestedLPText = text;
      });

    // Notes Translations START

    this.translate.get("Charts.Notes.sale").subscribe((text: string) => {
      this.sale = text;
    });

    this.translate.get("Charts.Notes.rent").subscribe((text: string) => {
      this.rent = text;
    });

    this.translate.get("Charts.Notes.Sale").subscribe((text: string) => {
      this.Sale = text;
    });

    this.translate.get("Charts.Notes.Rent").subscribe((text: string) => {
      this.Rent = text;
    });

    this.translate.get("Charts.Notes.rental").subscribe((text: string) => {
      this.rental = text.charAt(0).toUpperCase() + text.slice(1);
      this.rental2 = text;
    });

    this.translate.get("Charts.Notes.sales").subscribe((text: string) => {
      this.sales = text.charAt(0).toUpperCase() + text.slice(1);
      this.sales2 = text;
    });

    this.translate.get("Charts.Notes.closing").subscribe((text: string) => {
      this.closing = text;
    });

    this.translate.get("Charts.Notes.renting").subscribe((text: string) => {
      this.renting = text;
    });

    this.translate.get("Charts.Notes.closed").subscribe((text: string) => {
      this.closed = text;
    });

    this.translate.get("Charts.Notes.sold").subscribe((text: string) => {
      this.sold = text;
    });

    this.translate.get("Charts.Notes.rented").subscribe((text: string) => {
      this.rented = text;
    });

    this.translate.get("Charts.Notes.buyer").subscribe((text: string) => {
      this.buyer = text;
    });

    this.translate.get("Charts.Notes.tenant").subscribe((text: string) => {
      this.tenant = text;
    });

    this.translate.get("Charts.Notes.buyers").subscribe((text: string) => {
      this.buyers = text;
    });

    this.translate.get("Charts.Notes.tenants").subscribe((text: string) => {
      this.tenants = text;
    });

    this.translate.get("Charts.Notes.seller").subscribe((text: string) => {
      this.seller = text;
    });

    this.translate.get("Charts.Notes.landlord").subscribe((text: string) => {
      this.landlord = text;
    });

    this.translate.get("Charts.Notes.sellers").subscribe((text: string) => {
      this.sellers = text;
    });

    this.translate.get("Charts.Notes.landlords").subscribe((text: string) => {
      this.landlords = text;
    });

    this.translate.get("Charts.Notes.contract").subscribe((text: string) => {
      this.contract = text;
    });

    this.translate.get("Charts.Notes.lease").subscribe((text: string) => {
      this.lease = text;
    });

    // Notes Translations END

    this.translate
      .get("Charts.Analytics.APC Days on Market")
      .subscribe((text: string) => {
        this.capDOM = text.toUpperCase();
      });

    this.translate
      .get("Charts.Market Type." + this.marketType)
      .subscribe((text: string) => {
        this.marketTypeText = text;
        if (this.rentalChartDisplay === true) {
          this.translate
            .get("Charts.Analytics.APC Probability of Rent Alt")
            .subscribe((text: string) => {
              this.capPOS = text.toUpperCase();
              this.get_chart_details(this.currentId);
            });
        } else {
          this.translate
            .get("Charts.Analytics.APC Probability of Sale Alt")
            .subscribe((text: string) => {
              this.capPOS = text.toUpperCase();
              this.get_chart_details(this.currentId);
            });
        }
        this.get_chart_details(this.currentId);
        this.initiateMap();
        this.initiateMapReport();
      });
  }

  deleteFromChart(mlsNumber, status) {
    // Set Variables to Filter Homes
    var house = this.chart.relatedHomes.filter(function (el) {
      return el.mlsNumber === mlsNumber;
    });

    //console.log(this.chart.offMarketHomes);

    var house2 = this.chart.offMarketHomes.filter(function (el) {
      //console.log(el.mlsNumber);
      return el.mlsNumber === mlsNumber;
    });

    Swal.fire({
      title: this.ConfirmDeleteProperty,
      text:
        this.ConfirmDeletePropertytext1 +
        house[0].address +
        this.ConfirmDeletePropertytext2,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.value) {
        var activeHouse = this.chart.activeHomes.filter(function (el) {
          return el.mlsNumber === mlsNumber;
        });

        var pendingHouse = this.chart.pendingHomes.filter(function (el) {
          return el.mlsNumber === mlsNumber;
        });

        var closedHouse = this.chart.closedHomes.filter(function (el) {
          return el.mlsNumber === mlsNumber;
        });

        // Set Variable to get home based on Filtration
        var houseIdx = this.chart.relatedHomes.indexOf(house[0]);
        var activeHouseIdx = this.chart.activeHomes.indexOf(activeHouse[0]);
        var pendingHouseIdx = this.chart.pendingHomes.indexOf(pendingHouse[0]);
        var closedHouseIdx = this.chart.closedHomes.indexOf(closedHouse[0]);
        var offMarketHomesIdx = this.chart.offMarketHomes.indexOf(house2[0]);

        /* console.log(this.chart.relatedHomes);
        console.log(this.chart.offMarketHomes);

        console.log(house[0]);
        console.log(house2[0]);

        console.log(offMarketHomesIdx);
        console.log(houseIdx);

        console.log(offMarketHomesIdx);
        console.log(houseIdx); */
        //return;

        // Run Inquiry of which type of home was deleted
        if (houseIdx > -1 && activeHouseIdx > -1) {
          this.chart.activeHomes.splice(activeHouseIdx, 1);
          this.chart.relatedHomes.splice(houseIdx, 1);
          if (offMarketHomesIdx > 0) {
            //console.log('in1');
            this.chart.offMarketHomes.splice(offMarketHomesIdx, 1);
          }

          this.activeCount = this.chart.activeHomes.length;
        } else if (houseIdx > -1 && pendingHouseIdx > -1) {
          this.chart.pendingHomes.splice(pendingHouseIdx, 1);
          this.chart.relatedHomes.splice(houseIdx, 1);
          if (offMarketHomesIdx > 0) {
            //console.log('in2');
            this.chart.offMarketHomes.splice(offMarketHomesIdx, 1);
          }

          this.pendingCount = this.chart.pendingHomes.length;
        } else if (houseIdx > -1 && closedHouseIdx > -1) {
          this.chart.closedHomes.splice(closedHouseIdx, 1);
          this.chart.relatedHomes.splice(houseIdx, 1);
          if (offMarketHomesIdx > 0) {
            //console.log('in3');
            this.chart.offMarketHomes.splice(offMarketHomesIdx, 1);
          }
          this.closeCount = this.chart.closedHomes.length;
        } else {
        }

        //console.log(this.chart);
        this.showoutlier = true;
        this.regenrateChart();
        this.modalService.dismissAll();
      }
    });
  }

  starShowHide() {
    this.starShow = !this.starShow;
    if (this.starShow) {
      this.StarButtonName = "Hide";
    } else {
      this.StarButtonName = "Show";
    }
  }

  propertyLegendHide() {
    //console.log("Show Market");
    this.propLegendCheck = false;
    this.marketLegendCheck = true;
  }

  marketLegendHide() {
    //console.log("Show Property");
    this.propLegendCheck = true;
    this.marketLegendCheck = false;
  }

  legendHide() {
    //console.log("Hide All");
    this.propLegendCheck = false;
    this.marketLegendCheck = false;
  }

  legendShow() {
    //console.log("Show All");
    this.propLegendCheck = true;
    this.marketLegendCheck = true;
  }

  modifySearch() {
    if (this.redirect == true) {
      this.router.navigate([
        "/new-chart/property-value-analysis/" +
          this.currentId +
          "/redirectBackToAnalysis",
      ]);
    } else {
      this.router.navigate([
        "/new-chart/property-value-analysis/" + this.currentId,
      ]);
    }
    //
  }

  backtoanalysis() {
    var remember_investment_id = localStorage.getItem("remember_investment_id");

    //console.log(this.chart.relatedProperty.listing_type);
    //console.log(remember_investment_id);

    if (this.chart.relatedProperty.listing_type == "Residential") {
      //console.log('new-chart-created-rent');
      localStorage.setItem("new-chart-created-resi", this.currentId);

      if (remember_investment_id != "undefined") {
        this.router.navigate([
          "/analysis/" + remember_investment_id + "/redirectBackToAnalysis/",
        ]);
      } else {
        this.router.navigate([
          "/analysis/new-investment/redirectBackToAnalysis",
        ]);
      }
    } else {
      //console.log('new-chart-created-resi');
      localStorage.setItem("new-chart-created-rent", this.currentId);
      if (remember_investment_id != "undefined") {
        this.router.navigate([
          "/analysis/" + remember_investment_id + "/redirectBackToAnalysis/",
        ]);
      } else {
        this.router.navigate([
          "/analysis/new-investment/redirectBackToAnalysis",
        ]);
      }
    }
  }

  getClients() {
    console.log("Get Clients");
    //console.log(newresponse);

    //this.loader = true;

    //console.log(localStorage.getItem('f_mls'));
    //if(localStorage.getItem('f_mls') != 'undefined'){
    this.api.getClientList(localStorage.getItem("f_mls")).subscribe(
      (dataResponse) => {
        const response = dataResponse;
        this.clients = response;
        //console.log("Clients");
        //console.log(this.clients);
        if (this.clients != undefined) {
          //console.log("Not undefined");
          for (let index = 0; index < this.clients.length; index++) {
            const element = this.clients[index];
            if (element._id == this.client_id) {
              this.selectedClient = element;
              this.groupNameClient = element.firstname + " " + element.lastname;
            }
          }
        } else {
          console.log("Continue");
        }
        //console.log(this.client_id);
        //this.loader = false;
      },
      (error) => {
        //this.loader = false;
        console.log("No Clients");
        this.clients = [];
        console.log(error);
      }
    );
  }

  selectClientNew(client) {
    //console.log(client);
    this.client_id = client._id;
    this.selectedClient = client;
    this.groupNameClient = client.firstname + " " + client.lastname;
    if (this.redirect) {
      this.router.navigate([
        "/chart/" + this.currentId + "/redirectBackToAnalysis/" + client._id,
      ]);
    } else {
      this.router.navigate(["/chart/" + this.currentId + "/" + client._id]);
    }
  }

  clearClientNew() {
    this.client_id = "";
    this.translate
      .get("Property.AddProperty.Select client")
      .subscribe((text: string) => {
        this.groupNameClient = text;
      });

    if (this.redirect) {
      this.router.navigate([
        "/chart/" + this.currentId + "/redirectBackToAnalysis/",
      ]);
    } else {
      this.router.navigate(["/chart/" + this.currentId + "/"]);
    }
  }

  share() {
    console.log(this.socialSubject);
    console.log(this.sharePopupForm.value);
    let fbsharetext =
      "Available: " +
      this.sharePopupForm.value.available +
      " \n Address: " +
      this.sharePopupForm.value.address +
      " \n cmaIQ Price: " +
      this.sharePopupForm.value.price +
      " \n Beds: " +
      this.sharePopupForm.value.beds +
      " \n Baths: " +
      this.sharePopupForm.value.baths +
      " \n SQFT: " +
      this.sharePopupForm.value.sqft +
      " \n Agent: " +
      this.sharePopupForm.value.agent_name +
      " \n Agent phone: " +
      this.sharePopupForm.value.agent_phone +
      " \n Agent email: " +
      this.sharePopupForm.value.agent_email +
      " \n Agency: " +
      this.sharePopupForm.value.agency +
      " \n Website: " +
      this.sharePopupForm.value.webiste +
      " \n Notes: " +
      this.sharePopupForm.value.note;

    const options: UIParams = {
      method: "share",
      display: "popup",
      href: this.shareurl,
      quote: fbsharetext,
    };

    this.fb
      .ui(options)
      .then((res: UIResponse) => {
        console.log("Got the users profile", res);
      })
      .catch(this.handleError);
  }

  validatesharePopupForm() {
    var lower_bound = this.converterpipe.transform(
      this.plotResp.estimated_home_value.sales_price.lower_bound,
      this.currentcurrency,
      "1.0-0"
    );
    var upper_bound = this.converterpipe.transform(
      this.plotResp.estimated_home_value.sales_price.upper_bound,
      this.currentcurrency,
      "1.0-0"
    );

    this.sharePopupForm = this.formBuilder.group({
      available: ["Immediately"],
      address: [
        this.chart.targetProperty.address
          ? this.chart.targetProperty.address
          : "-",
        [Validators.required],
      ],
      price: [lower_bound + " - " + upper_bound, [Validators.required]],
      beds: [
        this.chart.targetProperty.bedroom,
        [Validators.pattern("^[0-9]*$"), Validators.minLength(1)],
      ],
      baths: [
        this.chart.targetProperty.bathroom,
        [Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      sqft: [
        this.chart.targetProperty.squareFootage,
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(3),
          Validators.maxLength(5),
        ],
      ],
      agent_name: [this.chart.agent.fullName],
      agent_phone: [this.chart.agent.phone],
      agent_email: [this.chart.agent.email],
      agency: [this.chart.agent.company],
      webiste: [this.chart.agent.website],
      note: [""],
      chart_id: [this.currentId],
      property_image: [this.chart.targetProperty.image],
    });

    this.socialSubject =
      "Available: " +
      this.sharePopupForm.value.available +
      "\nAddress: " +
      this.sharePopupForm.value.address +
      "\ncmaIQ Price: " +
      this.sharePopupForm.value.price +
      "\nBeds: " +
      this.sharePopupForm.value.beds +
      "\nBaths: " +
      this.sharePopupForm.value.baths +
      "\nSQFT: " +
      this.sharePopupForm.value.sqft +
      "\nAgent: " +
      this.sharePopupForm.value.agent_name +
      "\nAgent phone: " +
      this.sharePopupForm.value.agent_phone +
      "\nAgent email: " +
      this.sharePopupForm.value.agent_email +
      "\nAgency: " +
      this.sharePopupForm.value.agency +
      "\nWebsite: " +
      this.sharePopupForm.value.webiste +
      "\nNotes: " +
      this.sharePopupForm.value.note +
      "\n";
  }

  sharePopupSubmit() {
    //contact-us
    var cc = "";
    this.loader = true;
    this.showMsgSuccess = false;
    this.showMsgError = false;

    var body = this.sharePopupForm.value;

    /* const body = {
       'agent_name':this.chart.agent.fullName,
       'subject': this.emailUser.value.subject,
       'email': this.emailUser.value.email,
       'cc': cc,
       'message': this.emailUser.value.message,
       'url': this.router.url.replace(/^\/+/g, ''),
       'link_label': 'View Property'
     }; */

    this.api.sharesubmit(body).subscribe(
      (dataResponse) => {
        const response = dataResponse;
        this.showMsgSuccess = true;
        this.loader = false;
        if (dataResponse.id) {
          this.shareurl = environment.ShareEndpoint + dataResponse.id;
          this.modalService
            .open(this.sharepopupbtn, {
              ariaLabelledBy: "modal-basic-title",
              size: "lg",
            })
            .result.then(
              (result) => {
                this.closeResult = `Closed with: ${result}`;
              },
              (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              }
            );
        }
      },
      (error) => {
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
        this.loader = false;
      }
    );
  }

  sharePopup() {
    //this.hideSharePopup = false;

    this.validatesharePopupForm();
    this.modalService
      .open(this.sharepopup, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  /**
   * This is a convenience method for the sake of this example project.
   * Do not use this in production, it's better to handle errors separately.
   * @param error
   */
  private handleError(error) {
    console.error("Error processing action", error);
  }

  sortByfilterFunction(sortBy) {
    this.sortByfilter = sortBy;
    if (this.sortreverse == false) {
      this.sortreverse = true;
    } else {
      this.sortreverse = false;
    }
  }
}
