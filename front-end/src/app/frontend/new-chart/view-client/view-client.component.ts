import { Component, OnInit,HostListener } from '@angular/core';
import { ChartService } from "../../../services/chart.service";

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers:[ChartService]

})
export class ViewClientComponent implements OnInit {
  loader = false;
  clients;
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
    this.getClients();
  }

  getClients(){

    this.loader = true;
    this.totalpages = [];
    this.clients = [];
    this.totalnumpages = 0;
    var body = {
      'pageNumber': this.page,
      'maxRecords': this.limit,
      'f_mls':localStorage.getItem('f_mls')
    }

    this.api.getClientListNew(body).subscribe((dataResponse) => {
      const response = dataResponse.data;
      this.totalnumpages = dataResponse.total_pages;
      this.totalpages = this.createRange(this.totalnumpages);
      this.clients = response;
      //console.log(response);
      this.loader = false;
    },
    error => {
     this.loader = false;
      console.log(error);
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
    this.getClients();
  }

  prevPage() {
    this.page = this.page - 1;
    this.getClients();
  }

  nextPage() {
    this.page = this.page + 1;
    this.getClients();
  }

  onChangeLimit(event) {
    this.page = 1;
    const limit = event.target.value;
    //console.log(limit);
    this.limit = limit;
    this.getClients();
  }

  deleteClient(id){

    const body = {
      'id': id,
    };

    if (confirm("Are you sure you want to remove this client?")) {
      this.loader = true;
      this.api.delete_client(body).subscribe((dataResponse) => {
        const response = dataResponse;
        this.getClients();
        this.loader = false;
      },
      error => {
       this.loader = false;
        console.log(error);
      });

    }

  }

}
