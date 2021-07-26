import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { ActivatedRoute } from '@angular/router';
import { ConvertPipe } from '../../../pipes/convert.pipe';
import { SharedMlsService } from 'src/app/services/shared-mls.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ConvertPipe]
})
export class ReportsComponent implements OnInit {
  @Input() currentcurrencyInt: any;
  currentcurrency = 'USD';
  currentId;
  chartdata;
  chart;
  loader = false;
  plotRespRental;
  plotRespResiDential;
  

  constructor(private sharedMlsService: SharedMlsService,private converterpipe: ConvertPipe,public route: ActivatedRoute,private api: ChartService) { 

    this.sharedMlsService.dataString2$.subscribe(
      data => {
        this.currentcurrency = data;
        //console.log(data);
        //this.generateChart(this.dic9);
        //this.gotSearchData(data);
      });

  }

  ngOnInit() {

    this.currentcurrency = this.currentcurrencyInt;
    
    this.route.params.subscribe(res => {
      this.currentId = res.id;
    });

    this.get_chart_details(this.currentId);

    //this.get_chart_details();
  }

  get_chart_details(currentId) {

    let body = {
      "id": currentId
    };

    this.loader = true;
    this.api.get_chart_details_investment(body).subscribe((dataResponse) => {
      
      this.chartdata = dataResponse.data;
      //console.log(this.chartdata);
      this.chart = this.chartdata;
      if(this.chartdata.investment.propertyValueRen_chart_id){
        let body = {
          "id":  this.chartdata.investment.propertyValueRen_chart_id
        };
    
        this.loader = true;
        this.api.get_chart_details(body).subscribe((dataResponse) => {
          //this.chart = dataResponse.data;
          this.plotRespRental = JSON.parse(dataResponse.response);
          this.loader = false;
        });
      }
      else
      {
        this.plotRespRental = true;
        this.loader = false;
        
      }

      if(this.chartdata.investment.propertyValueRes_chart_id){
        let body = {
          "id":  this.chartdata.investment.propertyValueRes_chart_id
        };
    
        this.loader = true;
        this.api.get_chart_details(body).subscribe((dataResponse) => {

          //this.chart = dataResponse.data;
          this.plotRespResiDential = JSON.parse(dataResponse.response);
          this.loader = false;
        });
      }
      else
      {
        this.plotRespResiDential = true;
        this.loader = false;
        
      }

    },
    error => {
      this.loader = false;
      console.log(error);
    });
  }
}
