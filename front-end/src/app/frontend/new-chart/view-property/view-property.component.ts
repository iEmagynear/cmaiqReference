import { Component, OnInit,HostListener } from '@angular/core';
import { ChartService } from "../../../services/chart.service";

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.scss'],
  providers:[ChartService]

})
export class ViewPropertyComponent implements OnInit {

  loader = false;
  clients=[];
  states;
  innerHeight;
  page = 1;
  limit = 10;
  totalpages;
  totalnumpages = 0;
  constructor(private api:ChartService) {
    this.onResize();
  }

  @HostListener('window:resize')
   onResize() {
     if(screen.width < 767){
      this.innerHeight = (window.innerHeight) - 200 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
   }

  ngOnInit() {

    this.getStates();
  }

  getStates(){

    this.loader = true;
    this.api.getStateList().subscribe((dataResponse) => {
      const response = dataResponse;
      this.states = response;
      this.getProperties();
      //console.log(response);
      this.loader = false;
    },
    error => {
     this.loader = false;
      //this.showMsgError = true;
      console.log(error);
      //this.errormsg = error.message;
    });

  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  changePage(page){
    this.page = page;
    this.getProperties();
  }

  prevPage() {
    this.page = this.page - 1;
    this.getProperties();
  }

  nextPage() {
    this.page = this.page + 1;
    this.getProperties();
  }

  onChangeLimit(event) {
    this.page = 1;
    const limit = event.target.value;
    console.log(limit);
    this.limit = limit;
    this.getProperties();
  }

  getProperties(){
    this.totalpages = [];
    this.clients = [];
    this.loader = true;
    this.totalnumpages = 0;
    var body = {
      'pageNumber': this.page,
      'maxRecords': this.limit,
      'f_mls':localStorage.getItem('f_mls')
    }

    this.api.getPropertyListNew(body).subscribe((dataResponse) => {
      const response = dataResponse.data;
      this.totalnumpages = dataResponse.total_pages;
      this.totalpages = this.createRange(this.totalnumpages);
      //console.log(response);
      for (var i = 0; i < response.length; i++){
        for (var ii = 0; ii < this.states.length; ii++){
          if (this.states[ii]._id == response[i].state){
            var state = this.states[ii];
            //console.log(state.name);
            this.clients.push({
              address: response[i].address,
              city: response[i].city,
              client: response[i].client,
              mls_user_id: response[i].mls_user_id,
              property_image:(response[i].property_image)?response[i].property_image:'../../../assets/images/services1.png',
              square_footage: response[i].square_footage,
              state: state.name,
              zip: response[i].zip,
              property_type: (response[i].property_type)?response[i].property_type:'-',
              bedroom: (response[i].bedroom)?response[i].bedroom:'-',
              bathroom: (response[i].bathroom)?response[i].bathroom:'-',
              mls_number: (response[i].mls_number)?response[i].mls_number:'-',
              _id: response[i]._id
            })
          }
        }
      }

      this.loader = false;
    },
    error => {
     this.loader = false;
      //this.showMsgError = true;
      console.log(error);
      //this.errormsg = error.message;
    });

  }

  deleteProperty(id){
    const body = {
      'id': id,
    };

    if (confirm("Are you sure you want to remove this property?")) {
      this.loader = true;
      this.api.delete_property(body).subscribe((dataResponse) => {
        const response = dataResponse;
        this.getProperties();
        this.loader = false;
      },
      error => {
       this.loader = false;
        console.log(error);
      });

    }
  }
}
