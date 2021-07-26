import { Component, OnInit, HostListener } from '@angular/core';
import { ChartService } from "../../services/chart.service";

@Component({
  selector: 'app-mycharts',
  templateUrl: './mycharts.component.html',
  styleUrls: ['./mycharts.component.scss'],
  providers: [ChartService]
})
export class MychartsComponent implements OnInit {

  public innerHeight;
  loader = false;
  hasTypes: boolean = false;
  charts = [];
  public selectedAll;
  constructor(private api: ChartService) {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    if (screen.width < 767) {
      this.innerHeight = (window.innerHeight) - 200 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
  }

  ngOnInit() {

    this.get_charts();
  }

  get_charts() {

    this.loader = true;
    this.charts = [];
    var fmls = localStorage.getItem('f_mls');
    const body = {
      'id': fmls,
    }

    this.api.get_mls_details(body).subscribe((dataResponse) => {
      //console.log("Type Check: " + dataResponse.data.hasRental)
      this.hasTypes = dataResponse.data.hasRental;
    },
      error => {
        this.hasTypes = false;
        console.log(error);
      });

    this.api.get_charts(fmls).subscribe((dataResponse) => {

      const response = dataResponse.data;
      //this.charts = response;
      response.forEach((element, index) => {
        
       if(element.investment){

        if(element.investment.loanvalue){
          element.type = { label: "investment" }; 
        }
        else
        {
          if(element.relatedProperty.listing_type  == 'Residential'){
            element.type = { label: "noinvestment" }; 
          }
          else{
            element.type = { label:"noinvestment" }; 
          }
        }

       }
       else{
        if(element.relatedProperty.listing_type  == 'Residential'){
          element.type = { label: "noinvestment" }; 
        }
        else{
          element.type = { label:"noinvestment" }; 
        }
       }
       //console.log(element);
       this.charts.push(element);
      });

      this.loader = false;
    },
      error => {
        this.loader = false;
        console.log(error);
      });

  }

  selectAll() {
    for (let i = 0; i < this.charts.length; i++) {
      this.charts[i].selected = this.selectedAll;
    }
  }
  deleteChart(id) {
    console.log(id);
    const body = {
      'id': id
    };

    if (confirm("Are you sure you want to delete this chart?")) {
      this.loader = true;
      //console.log('if');
      this.api.delete_chart_item(body).subscribe(
        (dataResponse: any) => {

          if (dataResponse.message) {
            this.loader = false;
            this.get_charts();
          }
        },
        (error) => {
          this.loader = false;
        });
    }
    else {
      //console.log('else');
    }
  }

  deleteChartlist() {
    var array = [];
    this.charts.forEach((element, index) => {
      if (element.selected) {
        array.push({
          _id: element._id,
          selected: element.selected

        });
        //console.log(element._id);
      }

    });

    if (array.length > 0) {
      if (confirm("Are you sure you want to delete these charts?")) {
        array.forEach((element, index) => {
          //console.log(element);
          const body = {
            'id': element._id,
          };
          this.api.delete_chart_item(body).subscribe(
            (dataResponse) => {
              //console.log(dataResponse);
              //this.page = 1;
              this.get_charts();
            },
            (error) => {
              this.loader = false;
            });
        });
        this.selectedAll = false;
      }
    }
    else {
      alert('Select atleast one row.');
    }

  }
}
