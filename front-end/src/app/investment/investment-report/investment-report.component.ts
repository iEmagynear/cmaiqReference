import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartService } from 'src/app/services/chart.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FacebookService, InitParams,UIParams, UIResponse } from 'ngx-facebook';
import { SharedMlsService } from 'src/app/services/shared-mls.service';

@Component({
  selector: 'app-investment-report',
  templateUrl: './investment-report.component.html',
  styleUrls: ['./investment-report.component.scss']
})
export class InvestmentReportComponent implements OnInit {

  currentId;
  chartdata;
  loader = false;
  public tabactive = 1;
  plotRespResiDential;
  plotRespRental;
  public tabDropdownMenu = ['Annual Investment', 'Annualized Rate of Return', 'Cash Flow', 'Tax Benefit / Liability', 'Principal Paydown', 'Home Value Appreciation', 'Home Equity'];
  public tabsMenuList = ['Analytics', 'Notes', 'Report'];
  public innerHeight;
  accessToken: any;
  showMsgSuccess = false;
  showMsgError = false;
  emailUser: any;
  errormsg: any;
  chart: any;
  @ViewChild('email') email;
  closeResult: string;
  emailCopyCheck = false;
  socialSubject: string;
  sharedurl: string;
  currentcurrency: any;

  constructor(private sharedMlsService: SharedMlsService,private fb: FacebookService, public route: ActivatedRoute, private api: ChartService
    ,private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,) { }

  ngOnInit() {

    this.route.params.subscribe(res => {
      this.currentId = res.id;
    });

    this.get_chart_details(this.currentId);
    this.accessToken = JSON.parse(localStorage.getItem('currentUser'));

  }

  @HostListener('window:load')
  onResize() {
    this.innerHeight = window.innerHeight - 195 + "px";
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

      if (!this.chart.currencyValues) {
        this.api.get_exchange_price().subscribe((dataResponse) => {
          var quotesCheck = dataResponse.currencies;
          //console.log(quotesCheck)
          if (quotesCheck != null) {
            localStorage.setItem('USD', quotesCheck.quotes.USDUSD)
            localStorage.setItem('CAD', quotesCheck.quotes.USDCAD)
            localStorage.setItem('MXN', quotesCheck.quotes.USDMXN)
          } else {
            localStorage.setItem('USD', '1')
            localStorage.setItem('CAD', '1.32239')
            localStorage.setItem('MXN', '18.79079')
          }
        }, err => {
          console.log("ERROR!")
          console.log(err);
        });
      } else {
        var quotes = this.chart.currencyValues;
        localStorage.setItem('USD', quotes.USDUSD)
        localStorage.setItem('CAD', quotes.USDCAD)
        localStorage.setItem('MXN', quotes.USDMXN)
      }

      var address = this.chart.targetProperty.address;
      var title = this.chart.chart_title;
      var homeInput = "";
      if (address != "") {
        homeInput = address;
      } else {
        homeInput = title;
      }
      this.socialSubject = 'cmaIQ Investment Analysis for ' + homeInput + ".";
      //console.log(this.socialSubject);

      this.sharedurl = window.location.href;

      if (this.chartdata.investment.propertyValueRen_chart_id) {
        let body = {
          "id": this.chartdata.investment.propertyValueRen_chart_id
        };

        this.loader = true;
        this.api.get_chart_details(body).subscribe((dataResponse) => {
          //this.chart = dataResponse.data;
          this.plotRespRental = JSON.parse(dataResponse.response);
          this.loader = false;
        });
      }
      else {
        this.plotRespRental = true;
        this.loader = false;

      }

      if (this.chartdata.investment.propertyValueRes_chart_id) {
        let body = {
          "id": this.chartdata.investment.propertyValueRes_chart_id
        };

        this.loader = true;
        this.api.get_chart_details(body).subscribe((dataResponse) => {

          //this.chart = dataResponse.data;
          this.plotRespResiDential = JSON.parse(dataResponse.response);
          this.loader = false;
        });
      }
      else {
        this.plotRespResiDential = true;
        this.loader = false;

      }

    },
      error => {
        this.loader = false;
        console.log(error);
      });
  }

  tabActive(tab) {

    //console.log(tab);
    this.tabactive = tab;

  }

  validateEmailForm() {
    this.emailCopyCheck = false;
    //console.log(this.chart);
    var address = this.chart.targetProperty.address;
    var title = this.chart.chart_title;
    var homeInput = "";
    if (address != "") {
      homeInput = address;
    } else {
      homeInput = title;
    }
    this.emailUser = this.formBuilder.group({
      subject: ['cmaIQ Investment Analysis for ' + homeInput + ".", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      email: ['', [Validators.maxLength(255), Validators.required]],
      message: ['']
    });
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
      'agent_name':this.chart.agent.fullName,
      'subject': this.emailUser.value.subject,
      'email': this.emailUser.value.email,
      'cc': cc,
      'message': this.emailUser.value.message,
      'url': this.router.url.replace(/^\/+/g, ''),
      'link_label': 'View Investment Analysis'
    };


    this.api.sendEmail(body).subscribe((dataResponse) => {

      const response = dataResponse;
      this.showMsgSuccess = true;
      this.loader = false;

      setTimeout(() => {
        this.emailUser.controls.subject.setValue('cmaIQ Investment Analysis for' + this.chart.targetProperty.address + ".");
        this.emailUser.controls.email.setValue(this.chart.client.email);
        this.emailUser.controls.message.setValue('');
        this.modalService.dismissAll();

      }, 3000);

    },
      error => {
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
        this.loader = false;
      }
    );

  }

  emailButton() {
    this.validateEmailForm();
    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.open(this.email);
  }

  clearEmail() {
    this.emailUser.controls.subject.setValue('APC Estimated Market Value for' + this.chart.targetProperty.address + ".");
    this.emailUser.controls.email.setValue(this.chart.client.email);
    this.emailUser.controls.message.setValue('');
    this.modalService.dismissAll();
  }

  open(content) {
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

  printButton() {
    window.print();
  }

  share() {

    const options: UIParams = {
      method: 'share',
      display: 'popup',
      href: this.sharedurl,
      quote:this.socialSubject

    };

    this.fb.ui(options)
      .then((res: UIResponse) => {
        console.log('Got the users profile', res);
      })
      .catch(this.handleError);

  }

  private handleError(error) {
    console.error('Error processing action', error);
  }

  showMessageFromCur(message) {
    //console.log(message);
    
    this.currentcurrency = message;
    this.sharedMlsService.setCurrency(message);
    //console.log("Currency: " + this.currentcurrency);
    /* this.get_chart_details(this.currentId);
    this.initiateMap();
    this.initiateMapReport(); */
  }

}
