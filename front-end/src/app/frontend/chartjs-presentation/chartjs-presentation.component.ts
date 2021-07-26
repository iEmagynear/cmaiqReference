import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { Chart, ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { CurrencyPipe } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { ConvertPipe } from './../../pipes/convert.pipe';


@Component({
  selector: 'app-chartjs-presentation',
  templateUrl: './chartjs-presentation.component.html',
  styleUrls: ['./chartjs-presentation.component.scss'],
  providers: [ChartService, ConvertPipe]
})
export class ChartjsPresentationComponent implements OnInit {

  closeResult: string;
  activeCount = 0;
  pendingCount = 0;
  closeCount = 0;
  isSeven = false;
  rentalChartDisplay = false;
  salesprice;
  squarefootage;
  estimatevalue;
  inverted;
  invertedtext;
  currentcurrency;
  runupdate = true;
  beachesFlag = false;
  f_mls;
  public scatterChartOptions: ChartOptions = {
    "layout": {
      "padding": {
      }
    },
    "animation": {
      "duration": 0
    },
    "scales": {
      "yAxes": [
        {
          "type": "linear",
          "scaleLabel": {
            "display": true,
            "labelString": this.salesprice,
            "fontFamily": "Montserrat, sans-serif",
            "fontSize": 20,
            "fontColor" : "#18558b",
            "fontStyle": "bold"
          },
          "ticks": {
            "fontFamily": "Montserrat, sans-serif",
            beginAtZero: false,
            minRotation: 0,
            maxRotation: 0,
            mirror: false,
            padding: 10,
            reverse: false,
            display: true,
            autoSkip: true,
            autoSkipPadding: 0,
            labelOffset: 0,
            "fontColor": "#18558b",
            "fontSize": 16,
            "fontStyle":"bold",
          }
        }
      ],
      "xAxes": [
        {
          "type": "linear",
          "position": "bottom",
          "gridLines": {
            "display": false
          },
          "scaleLabel": {
            "display": true,
            "labelString": this.squarefootage,
            "fontFamily": "Montserrat, sans-serif",
            "fontSize": 20,
            "fontStyle": "bold",
            "fontColor": "#18558b",
          },
          "ticks": {
            minRotation: 0,
            beginAtZero: false,
            maxRotation: 0,
            mirror: false,
            padding: 10,
            reverse: false,
            display: true,
            autoSkip: true,
            autoSkipPadding: 0,
            labelOffset: 0,
            "fontFamily": "Montserrat, sans-serif",
            "fontColor": "#18558b",
            "fontSize": 16,
            "fontStyle":"bold",
            callback: function(value, index, values) {

              const count = values.length - 1;
              let diff = 0;
              if (count > 2) {
                diff = values[2] - values[1];
              }

              if (index == 0 && value != 0 && ((values[1] - values[0]) < diff)) {
                return '';
              }

              if (index == count && count > 1 && ((values[count] - values[count - 1]) < diff)) {
                return '';
              }

              if (Math.floor(value) === value) {
                return value;
              }
            },
          }
        }
      ]
    },
    "legend": {
      "display": false
    },
    "hover": {
      "mode": "point"
    },
    responsive: true,
  };

  public scatterChartData: ChartDataSets[] = [
    {
      "label": "Estimated Home Value",
      "pointBackgroundColor": "#00ADF9",
      "pointBorderWidth": 2,
      "pointBorderColor": "#ababab",
      "pointHoverRadius": 14,
      "showLine": false,
      "pointRadius": 10,
      "data": []
    },
    {
      "label": "Sold Listing",
      "pointBackgroundColor": "#ff2a00",
      "pointBorderWidth": 2,
      "pointBorderColor": "#ababab",
      "pointHoverBorderColor": "#ababab",
      "pointHoverBackgroundColor": "#ff2a00",
      "pointHoverRadius": 8,
      "showLine": false,
      "pointRadius": 6,
      "data": []
    },
    {
      "label": "Under Contract",
      "borderWidth": 3,
      "pointBackgroundColor": "#e4e101",
      "pointBorderWidth": 2,
      "pointBorderColor": "#ababab",
      "pointHoverBorderColor": "#ababab",
      "pointHoverBackgroundColor": "#e4e101",
      "pointHoverRadius": 8,
      "showLine": false,
      "pointRadius": 6,
      "data": []
    },
    {
      "label": "Active Listing",
      "pointBackgroundColor": "#00b32a",
      "pointBorderWidth": 2,
      "pointBorderColor": "#ababab",
      "pointHoverBorderColor": "#ababab",
      "pointHoverBackgroundColor": "#00b32a",
      "pointHoverRadius": 8,
      "showLine": false,
      "pointRadius": 6,
      "data": []
    },
    {
      "label": "2 SD Above Average",
      "borderColor": "#d4e3fe",
      "backgroundColor": "rgba(212,227,254,.5)",
      "borderWidth": 0.3,
      "fill": false,
      "showLine": true,
      "lineTension": 0.3,
      "pointRadius": 0,
      "data": []
    },
    {
      "label": "1 SD Above Average",
      "borderColor": "#a8c6fe",
      "backgroundColor": "rgba(168,198,254,.5)",
      "borderWidth": 0.3,
      "pointBackgroundColor": "#a8c6fe",
      "pointBorderColor": "#a8c6fe",
      "fill": false,
      "showLine": true,
      "lineTension": 0.3,
      "pointRadius": 0,
      "data": []
    },
    {
      "label": "Average Home Price",
      "borderColor": "#0043aa",
      "borderWidth": 3,
      "pointBackgroundColor": "#0043aa",
      "pointBorderColor": "#0043aa",
      "fill": false,
      "showLine": true,
      "lineTension": 0.3,
      "pointRadius": 0,
      "data": []
    },
    {
      "label": "1 SD Below Average",
      "borderColor": "#a8c6fe",
      "borderWidth": 0.3,
      "pointBackgroundColor": "#a8c6fe",
      "pointBorderColor": "#a8c6fe",
      "fill": false,
      "showLine": true,
      "lineTension": 0.3,
      "pointRadius": 0,
      "data": []
    },
    {
      "label": "2 SD Below Average",
      "borderColor": "#d4e3fe",
      "borderWidth": 0.3,
      "pointBackgroundColor": "#d4e3fe",
      "pointBorderColor": "#d4e3fe",
      "fill": false,
      "showLine": true,
      "lineTension": 0.3,
      "pointRadius": 0,
      "data": []
    }
  ];
  loader = false;
  rateSite;
  rateLayout;
  rateCondition;
  rateQuantity;
  request;
  houseIcon;
  currentHouse;
  public scatterChartType: ChartType = 'line';
  @Input() plotResp: any;
  @Input() showoutlier: any;
  @Input() redirect: any;
  @Input() datasets: any;
  @Input() chart: any;
  @Input() toggles: any;
  @Input() staticdata: any;
  @Input() togglesActive: any;
  @Input() togglesPending: any;
  @ViewChild('content') content;
  @ViewChild(BaseChartDirective) private _chart;
  @Output() mlsNumberEvent = new EventEmitter<string>();
  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();
  salesdate: string;

  constructor(private converterpipe: ConvertPipe, public translate: TranslateService, private modalService: NgbModal, private api: ChartService) {

  }

  showMessageFromCur(message: any) {
    this.currentcurrency = message;
    this.updateChart();
  }

  showMessageFromChild(message: any) {

    this.translate.get('Charts.Chart.Sales Date').subscribe((text: string) => {
      this.salesdate = text;
    });

    this.translate.get('Charts.Chart.Square Footage').subscribe((text: string) => {
      this.squarefootage = text;

    });

    this.translate.get('Charts.Chart.Estimated Value').subscribe((text: string) => {
      this.estimatevalue = text;

    });

    this.translate.get('Sign Out.Inverted Curve Notice').subscribe((text: string) => {
      this.inverted = text;

    });

    this.translate.get('Sign Out.Inverted Curve Noticetext').subscribe((text: string) => {
      this.invertedtext = text;
      if (this.chart.relatedProperty.listing_type == 'Rental') {
        //console.log("Chart.js Rent")
        this.rentalChartDisplay = true;
        this.translate.get('Charts.Chart.Rental Price').subscribe((text2: string) => {
          this.salesprice = text2;
        });
      } else {
        //console.log("Chart.js Resi")
        this.rentalChartDisplay = false;
        this.translate.get('Charts.Chart.Sales Price').subscribe((text1: string) => {
          this.salesprice = text1;
        });
      }
      this.updateChart();
    });

  }

  ngOnChanges() {
    this.updateChart();
  }

  ngOnInit() {
    this.updateChart();
    this.f_mls = localStorage.getItem('f_mls');

    if( this.f_mls == '5d846e8de3b0d50d6ac919ec' ){
      //console.log('in');
      this.beachesFlag = true;
    }
  }

  updateChart() {
   //console.log(this.chart)
    this.isSeven = this.chart.closedHomes.length <= 7 ? true : false;
    this.houseIcon = new Image();
    this.houseIcon.src = 'assets/images/house-icon.png';
    this.houseIcon.alt = 'Estimated Home Value';
    this.houseIcon.title = 'Estimated Home Value';
    let _this = this;
    var plotResp = this.plotResp;
    var showoutlier = this.showoutlier;
    var outlierText = '';

    var countOutlier = plotResp.active_outliers.data.length + plotResp.pending_outliers.data.length + plotResp.sold_outliers.data.length;

    if (countOutlier > 0) {

      for (var i = 0, lenn = plotResp.active_outliers.data.length; i < lenn; i++) {

        outlierText += plotResp.active_outliers.data[i].address + ' ,';

      }

      for (var i = 0, lenn = plotResp.pending_outliers.data.length; i < lenn; i++) {

        outlierText += plotResp.pending_outliers.data[i].address + ' ,';

      }

      for (var i = 0, lenn = plotResp.sold_outliers.data.length; i < lenn; i++) {

        outlierText += plotResp.sold_outliers.data[i].address + ' ,';

      }

      outlierText = outlierText.slice(0, -1);

    }


    if (plotResp.estimated_home_value.inverted_curve_flag && countOutlier > 0) {

      Swal.fire({
        title: this.inverted,
        html: '<h6>' + this.invertedtext + '<h6>',
        width: '42em'
      }).then(function() {

        if (showoutlier) {
          Swal.fire({
            title: 'The following outliers have been removed to ensure statistical accuracy. They were eliminated because of a significant difference in price or square footage.',
            text: outlierText,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok!',
            width: '42em'
          });
        }

      });

    }

    if (plotResp.estimated_home_value.inverted_curve_flag && countOutlier == 0 && typeof (this.inverted) != 'undefined') {
      if (Swal.isVisible() == false) {
        Swal.fire({
          title: this.inverted,
          html: '<h6>' + this.invertedtext + '<h6>',
          width: '42em'
        });
      }

    }

    if (!plotResp.estimated_home_value.inverted_curve_flag && countOutlier > 0) {
      if (this.showoutlier) {
        Swal.fire({
          title: 'The following outliers have been removed to ensure statistical accuracy. They were eliminated because of a significant difference in price or square footage.',
          text: outlierText,
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok!',
          width: '42em'
        });
      }
    }

    var dataArray2 = [];
    for (var i = 0, len = this.scatterChartData.length; i < len; i++) {
      if (this.scatterChartData[i].label == 'Estimated Home Value') {

        dataArray2.push([{
          x: plotResp.estimated_home_value.area,
          y: plotResp.estimated_home_value.sales_price.estimate
        }]);

      }
      if (this.scatterChartData[i].label == 'Sold Listing') {

        dataArray2.push(
          plotResp.sold_listing.data
        );
      }
      if (this.scatterChartData[i].label == 'Under Contract') {
        if (!this.togglesPending) {
          dataArray2.push(
            []
          );
        }
        else {
          dataArray2.push(
            plotResp.under_contract.data
          );
        }
      }
      if (this.scatterChartData[i].label == 'Active Listing') {

        if (!this.togglesActive) {

          dataArray2.push(
            []
          );
        }
        else {
          dataArray2.push(
            plotResp.active_listing.data
          );
        }
      }
      if (this.scatterChartData[i].label == '2 SD Above Average') {

        dataArray2.push(
          plotResp["2_sd_above_average"].data
        );
      }
      if (this.scatterChartData[i].label == '1 SD Below Average') {

        dataArray2.push(
          plotResp["1_sd_below_average"].data
        );
      }
      if (this.scatterChartData[i].label == 'Average Home Price') {

        dataArray2.push(
          plotResp.average_home_price.data
        );
      }
      if (this.scatterChartData[i].label == '1 SD Above Average') {

        dataArray2.push(
          plotResp["1_sd_above_average"].data
        );
      }
      if (this.scatterChartData[i].label == '2 SD Below Average') {
        dataArray2.push(
          plotResp["2_sd_below_average"].data
        );
      }

    }

    this.scatterChartData[0].pointStyle = this.houseIcon;

    for (var i = 0, len = this.scatterChartData.length; i < len; i++) {

      this.scatterChartData[i].data = dataArray2[i];
    }

    this.scatterChartOptions.scales.yAxes[0].scaleLabel.labelString = this.salesprice;
    this.scatterChartOptions.scales.xAxes[0].scaleLabel.labelString = this.squarefootage;

    this.scatterChartOptions.scales.xAxes[0].ticks.min = plotResp.estimated_home_value.xrange.x_min_tick;
    this.scatterChartOptions.scales.xAxes[0].ticks.max = plotResp.estimated_home_value.xrange.x_max_tick;
    this.scatterChartOptions.scales.yAxes[0].ticks.min = plotResp.estimated_home_value.yrange.y_min_tick;
    this.scatterChartOptions.scales.yAxes[0].ticks.max = plotResp.estimated_home_value.yrange.y_max_tick;

    this.scatterChartOptions.scales.yAxes[0].ticks = {
      "fontFamily": "Montserrat, sans-serif",
      beginAtZero: false,
      minRotation: 0,
      maxRotation: 50,
      mirror: false,
      padding: 10,
      reverse: false,
      display: true,
      autoSkip: true,
      autoSkipPadding: 0,
      labelOffset: 0,
      "fontSize": 16,
      "fontColor": "#18558b",
      "fontStyle": "bold",
      callback: function(value, index, values) {

        const count = values.length - 1;
        let diff = 0;
        if (count > 2) {
          diff = values[1] - values[2];
        }
        if (index == count && value != 0 && ((values[count - 1] - values[count]) < diff)) {
          return '';
        }
        if (index == 0 && count > 1 && ((values[0] - values[1]) < diff)) {
          return '';
        }

        var str = value + '';
        var length = str.length;
        if (length > 6) {
          return _this.converterpipe.transform(str.slice(0, -6) + str.slice(-6, -3) + str.slice(-3), _this.currentcurrency, '1.0-0')
        } else if (length > 3) {
          return _this.converterpipe.transform(str.slice(0, -3) + str.slice(-3), _this.currentcurrency, '1.0-0')
        } else {
          return _this.converterpipe.transform(str, _this.currentcurrency, '1.0-0')
        }
      }
    }

    var chart = this.chart;
    let $this = this;
    this.scatterChartOptions.tooltips = {
      "enabled": false,
      "mode": "point",
      "position": "nearest",
      custom: this.photoTooltips,
      callbacks: {
        title: function(tooltipItems, data) {
          //console.log("TIPS", tooltipItems);
          const idx = tooltipItems[0].index;
          //console.log("idx",idx)
          var datasetIdx = tooltipItems[0].datasetIndex
          //console.log("datasetIdx",datasetIdx)
          var elId = data.datasets[datasetIdx].data[idx]["_id"];

          if (tooltipItems[0].datasetIndex === 0) {
            return [chart.targetProperty.address, chart.targetProperty.image];
          }

          var homeDataArr = chart.relatedHomes.filter(function(home) {
            //console.log(home._id);
            return home._id == elId;
          });
          console.log(homeDataArr[0]);
          return [homeDataArr[0].address, homeDataArr[0].photos[0]];
        },
        label: function(tooltipItem, data) {

          var sqFt = tooltipItem.xLabel;
          var sqFtLabel = $this.squarefootage + ': ' + sqFt;

          var price = tooltipItem.yLabel;
          var priceLabel;
          let currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
          if (tooltipItem.datasetIndex === 0) {
            let newValue: string = $this.converterpipe.transform(price, $this.currentcurrency, '1.0-0');
            priceLabel = $this.estimatevalue + ': ' + newValue;
          } else {
            let newValue: string = $this.converterpipe.transform(price, $this.currentcurrency, '1.0-0');
            priceLabel = $this.salesprice + ': ' + newValue;
          }

          return [sqFtLabel, priceLabel];
        }
      }
    };

    this._chart.refresh();

  }

  photoTooltips(tooltip) {
    //console.log(tooltip);
    // Tooltip Element
    var tooltipEl: any = document.getElementById('chartjs-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.innerHTML = "<table></table>";
      document.body.appendChild(tooltipEl);
    }
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }
    // Set Text
    if (tooltip.body) {
      var title = tooltip.title[0];
      var image = tooltip.title[1] ? tooltip.title[1] : 'assets/images/presentation-home.jpg';
      var bodyLines = tooltip.body[0].lines;
      //PUT CUSTOM HTML TOOLTIP CONTENT HERE (innerHTML)
      var innerHtml = '<thead>';
      innerHtml += '<tr><th>' + title + '</th></tr>';
      innerHtml += '</thead><tbody><tr><td><img src="' + image + '" /></td></tr>';
      bodyLines.forEach(function(line) {
        innerHtml += '<tr><td>' + line + '</td></tr>';
      });
      innerHtml += '</tbody>';
      var tableRoot = tooltipEl.querySelector('table');
      tableRoot.innerHTML = innerHtml;
    }

    var position = this._chart.canvas.getBoundingClientRect();
    /* console.log(tooltip);
    console.log(position); */
    //Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY -220 + 'px';
    tooltipEl.style.fontFamily = tooltip._fontFamily;
    tooltipEl.style.fontSize = tooltip.fontSize;
    tooltipEl.style.fontStyle = tooltip._fontStyle;
    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.backgroundColor = '#18558b'

  }

  chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      //console.log( this.chart.relatedHomes);
      //console.log(activePoints);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const idx = activePoints[0]._index;
        //console.log("idx",idx)
        var datasetIdx = activePoints[0]._datasetIndex
        //console.log("datasetIdx",datasetIdx)
        //const label = chart.data.labels[clickedElementIndex];
        // get value by index
        var elId = activePoints[0]._chart.config.data.datasets[datasetIdx].data[idx]._id
        //console.log(elId)
        //console.log(this.chart.relatedHomes);
        var homeDataArr = this.chart.relatedHomes.filter(function(home) {
          //console.log(home._id);
          return home._id == elId;
        });
        /* const value = chart.data.datasets[0].data[clickedElementIndex]; */
        //console.log( homeDataArr)
      }
      //console.log( homeDataArr)
      this.currentHouse = homeDataArr[0];
      //console.log(this.currentHouse )
      if (this.currentHouse) {
        for (var i = 0; i < this.currentHouse.photos.length; i++) {
          if (this.currentHouse.photos[i + 1] === this.currentHouse.photos[i]) {
            //console.log("Skip Again")
            this.currentHouse.photos.splice(i + 1, i);
          } else {
            //console.log("Proceed Again")
          }
        }
      }
      //console.log(this.currentHouse )

      if (homeDataArr.length > 0) {
        this.open(this.content);
      }

    }
  }

  open(content) {
    //console.log(content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  deleteFromChart(mlsNumber) {
    console.log(mlsNumber);
    this.showoutlier = true;
    this.sendMessage.emit(mlsNumber);
    //this.mlsNumberEvent.emit(mlsNumber);
    return false;

  }

  regenrateChart() {

    //console.log(this.chart.targetProperty);
    this.loader = true;
    if (this.request) {
      this.request.unsubscribe();
    }
    this.plotResp = null;
    this.request = this.api.editChartResponse(this.chart).subscribe((dataResponse) => {

      console.log(dataResponse);

      this.chart = dataResponse.data;
      //console.log(this.chart);

      var plotResp = JSON.parse(dataResponse.response);
      this.plotResp = plotResp;
      this.updateChart();
      this.loader = false;

    },
      (error) => {
        this.loader = false;
        console.log(error);
      });

  }


}
