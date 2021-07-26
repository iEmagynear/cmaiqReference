import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPropertyComponent } from '../new-chart/dialog-property/dialog-property.component';
import { MatDialog } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartService } from 'src/app/services/chart.service';
import { StatusService } from "../../services/status.service";
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-paragon',
  templateUrl: './paragon.component.html',
  styleUrls: ['./paragon.component.scss'],
  providers: [StatusService]
})
export class ParagonComponent implements OnInit {

  public paragon;
  public mlsName = 'Select';
  public chartType = 'Select';
  public subDivisions = [];
  public zipCode = [];
  public minimumDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  public maximumDate = new Date();
  public chartList = [{ id: 1, name: 'Residential' }, { id: 2, name: ' Rental' }];
  public paragonProperty = [
    { name: 'Paragon 1' },
    { name: 'Paragon 2' },
    { name: 'Paragon 3' },
    { name: 'Paragon 4' }
  ];
  loader = false;

  properties = [];
  public showft = true;
  public clearSelect = true;
  public askOption = 'More Options';
  public showHideAsk = false;
  public innerHeight;
  apiEndpoint: any;
  property_id: any;
  client_id: any;
  selectedImg: any;
  Id;
  mls_name = "Intermountain MLS";
  total_count = 0;
  active_count = 0;
  pending_count = 0;
  cancel_count = 0;
  saveBody;
  params;
  homes;
  tooBig;
  hasSeven;
  addChart;
  ssoValid;
  savedUser = null;


  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private api: ChartService,
    private http: HttpClient,
    public statusService: StatusService,
    private router: Router) {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    if (screen.width < 767) {
      this.innerHeight = (window.innerHeight) - 190 + 'px';
    } else {
      this.innerHeight = (window.innerHeight) - 130 + 'px';
    }
  }

  ngOnInit() {

    if (localStorage.getItem('currentUser') != null || localStorage.getItem('currentUser') != undefined) {
      this.savedUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log ("User");
      console.log(this.savedUser)
    } else {
      //console.log ("No User");
    }

    this.apiEndpoint = environment.APIEndpoint
    //console.log(this.apiEndpoint);

    this.route.params.subscribe((params) => {
      //console.log('params', params);
    });

    this.route.params.subscribe(res => {
      this.Id = res.id;
    });


    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.params = params;
      localStorage.setItem('queryListingid', this.params.listingid);
      localStorage.setItem('queryMlsid', this.params.mlsid);
      localStorage.setItem('queryAgentemail', (this.params.agentemail?this.params.agentemail:this.params.email));
      localStorage.setItem('queryOfficename', this.params.officename);
      localStorage.setItem('queryAgentphone', this.params.agentphone);
      if (this.savedUser != null) {
        //console.log(this.savedUser.email);
        //console.log(this.params.agentemail);
        if (this.savedUser.email === this.params.agentemail || this.savedUser.email === this.params.email) {
          this.router.navigate(['/paragonSubmit']);
        } else {
          this.loader = true;
          localStorage.removeItem('currentUser');
          if (localStorage.getItem('samlFlag') === 'true') {
            //console.log('Saml Active')
            localStorage.setItem('samlFlag', 'false');
          } else {
            localStorage.removeItem('samlFlag');
          }
          localStorage.removeItem('token');
          localStorage.removeItem('mls');
          localStorage.removeItem('f_mls');
          localStorage.removeItem('api');
          localStorage.removeItem('page');
          localStorage.removeItem('limit');
          localStorage.removeItem('searchText');
          localStorage.removeItem('sortBy');
          localStorage.removeItem('ascdesc');
          localStorage.removeItem('access_token');
          var api = this.apiEndpoint;
          if(this.params.mlsid.toUpperCase() == 'BEACHES'){
            window.location.href = api + "passport/ssoAuthBeach";
          }else{
            window.location.href = api + "passport/ssoAuth";
          }
        }
      } else {
        this.loader = true;
        var api = this.apiEndpoint;
        if(this.params.mlsid.toUpperCase() == 'BEACHES'){
          window.location.href = api + "passport/ssoAuthBeach";
        }else{
          window.location.href = api + "passport/ssoAuth";
        }
      }

    });
  }

  /*validateClearedXML() {
    this.http.get<any>(this.apiEndpoint + 'passport/xmlClear').subscribe((data) => {
      console.log("XML CLEARED Here");
      console.log(data.data);
      this.ssoValid = data.data;
      if (this.ssoValid.length === 0) {
        console.log("Proceed");
        var api = this.apiEndpoint;
        setTimeout(function() {
          //console.log(api);
          window.location.href = api + "passport/ssoAuth";
        }, 5000);
      } else {
        this.validateClearedXML();
        console.log("Rerun");
      }
    });
  }*/




}
