import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { ChartService } from "../../services/chart.service";
import { DashboardService } from "src/app/services/dashboard.service";
import { AuthServiceLocal } from "../../services/auth.service";
// import { Intercom } from 'ng-intercom';
import { IntercomService } from "src/app/services/intercom.service";
import { SharedMlsService } from "../../services/shared-mls.service";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "../../services/language.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute } from "@angular/router";
import { PropertiesUploadComponent } from "../properties-upload/properties-upload.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DialogClientComponent } from "../new-chart/dialog-client/dialog-client.component";
import { DialogPropertyComponent } from "../new-chart/dialog-property/dialog-property.component";
import { NewClientComponent } from "../new-chart/new-client/new-client.component";
import { ProspectingComponent } from "../new-chart/prospecting/prospecting.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  providers: [UserService, AuthServiceLocal],
})
export class HeaderComponent implements OnInit {
  isActive = false;
  currentLang = "English";
  loginFlag = false;
  samlFlag = false;
  investFlag = false;
  imlsHelpFlag = false;
  userFlag = false;
  currentId;
  checkmlsadmin = false;
  currentUrl;
  nrSelect;
  mls_array;
  currentCur;
  checkSuperAdmin = false;
  checkmember = false;
  public mlsName = "";
  @Output() mlsEvent = new EventEmitter<string>();
  @Output() childMessage = new EventEmitter<string>();
  @Output() curMessage = new EventEmitter<string>();
  @Input() redirect: any;
  showCurrency: boolean;
  active_investment: boolean;
  floating: boolean = false;
  active_import: boolean;
  mls_isupload_select;
  properties = [];
  property_id;
  loader = false;
  clients;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  addProperty;
  croppedImage: any = "";
  public groupName;
  requestNew: any;
  requestNew1: any;
  constructor(
    private language: LanguageService,
    public translate: TranslateService,
    public router: Router,
    public api: UserService,
    public authService: AuthServiceLocal,
    public dashboardapi: DashboardService,
    //public intercom: Intercom
    public intercomService: IntercomService,
    public sharedMlsService: SharedMlsService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private apiChart: ChartService
  ) {
    translate.addLangs(["English", "Español", "Français"]);
    translate.setDefaultLang("English");

    const browserLang = translate.getBrowserLang();
    //console.log(browserLang);
    //translate.use(browserLang.match(/fr|fr-FR/) ? 'fr-FR' : 'en-US');

    if (localStorage.getItem("currentUser") != null) {
      this.loginFlag = true;
      this.userFlag = true;
    } else {
      this.userFlag = false;
    }

    if (localStorage.getItem("samlFlag") === "true") {
      //console.log('SAML Login')
      //this.loginFlag = false;
      this.samlFlag = true;
      this.imlsHelpFlag = true;
      //this.userFlag = true;
    } else {
      //console.log("No SAML");
      this.samlFlag = false;
      this.imlsHelpFlag = false;
    }

    if (localStorage.getItem("investFlag") === "true") {
      this.investFlag = true;
    } else {
      this.investFlag = false;
    }
    this.active_investment = environment.active_investment;
  }

  ngOnInit() {
    this.active_import = environment.active_import;
    //this.getProperties();
    //this.getClients();
    //console.log(this.active_import);

    //console.log(this.redirect);
    this.language.currentMessage.subscribe((message) => {
      //console.log(message);
      this.currentLang = message;
      this.translate.use(message);
      this.childMessage.emit(message);
    });

    this.language.currentcur.subscribe((message) => {
      //console.log(message);
      this.currentCur = message;
      //this.translate.use(message);
      this.curMessage.emit(message);
    });

    this.sharedMlsService.currentMlsId.subscribe((mlsId) => {
      //console.log(mlsId);
      if (mlsId) {
        localStorage.setItem("f_mls", mlsId);
      }
    });

    this.getUserInfo();
    this.currentUrl = this.router.url;

    this.getMlsids();
    this.nrSelect = localStorage.getItem("f_mls");
    //this.mls_isupload_select = localStorage.getItem('f_mls_isupload');
    //console.log(localStorage.getItem('f_mls_isupload'));
    //console.log(this.mls_isupload_select);
  }

  onLngChange(lang) {
    //console.log(lang);
    this.currentLang = lang;
    this.translate.use(lang);
    //console.log(this.translate.currentLang);
    this.language.changeMessage(lang);
    this.childMessage.emit(lang);
  }

  onCurChange(cur) {
    //console.log(cur);
    this.currentCur = cur;
    this.language.changeCur(cur);
    //this.curMessage.emit(cur);
  }

  openDialog() {
    //const dialogRef = this.dialog.open(DialogPropertyComponent, {
    const dialogRef = this.dialog.open(NewClientComponent, {
      panelClass: "property-dialog-container",
      data: {
        action: "property",
      },
      width: "35em",
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if (result) {
        this.router.navigate([
          "/new-chart/property-value-analysis/new_client/" +
            (result.property_id + "/" + result.client_id),
        ]);
      }
      //this.getClients();
      //this.getProperties();
    });
  }
  openDialogProspecting() {
    const dialogRef = this.dialog.open(ProspectingComponent, {
      panelClass: "property-dialog-container",
      data: {
        action: "client",
      },
      width: "35em",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log(encodeURIComponent(result.chart_title));
        this.router.navigate([
          "/new-chart/property-value-analysis/prospecting/" +
            encodeURIComponent(result.chart_title) +
            "/" +
            result.sqr_ft,
        ]);
      }
    });
  }

  // getProperties() {
  //   this.properties = [];
  //   var properties = [];
  //   this.loader = true;
  //   this.apiChart.getPropertyList(localStorage.getItem('f_mls')).subscribe((dataResponse) => {
  //     const response = dataResponse;
  //     console.log(dataResponse);
  //     dataResponse.forEach(function (el, idx) {
  //       //console.log(el);
  //       //self.mapMarkers[idx].setMap(null);
  //       properties.push({
  //         _id: el._id,
  //         address: el.address,
  //         city: el.city,
  //         client: el.client,
  //         created: el.created,
  //         mls_user_id: el.mls_user_id,
  //         property_image: (el.property_image) ? el.property_image : '../../../assets/images/services1.png',
  //         square_footage: el.square_footage,
  //         state: el.state,
  //         updated: el.updated,
  //         zip: el.zip
  //       });
  //     });
  //     this.properties = properties;

  //     // if (this.Id != 'redirectBackToAnalysis' && this.Id) {
  //     //   this.get_chart_details(this.Id);
  //     // }

  //     this.loader = false;
  //   },
  //     error => {
  //       this.loader = false;
  //       //this.showMsgError = true;
  //       console.log(error);
  //       //this.errormsg = error.message;
  //     });

  // }
  getClients() {
    this.loader = true;
    this.apiChart.getClientList(localStorage.getItem("f_mls")).subscribe(
      (dataResponse) => {
        const response = dataResponse;
        this.clients = response;
        this.route.params.subscribe((res) => {
          this.currentId = res.id;
          //console.log(this.currentId);
          //this.getProperty(this.currentId);
          /* this.validateAddMlsUserForm(this.currentId);
        this.getClient(this.currentId); */
        });
        //console.log(response);
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      }
    );
  }
  getProperty(id) {
    this.loader = true;
    this.apiChart.get_property(id).subscribe(
      (dataResponse) => {
        this.addProperty.controls.address.setValue(dataResponse.data.address);
        this.addProperty.controls.city.setValue(dataResponse.data.city);
        this.addProperty.controls.state.setValue(dataResponse.data.state);
        this.addProperty.controls.zip.setValue(dataResponse.data.zip);
        this.addProperty.controls.id.setValue(dataResponse.data._id);
        this.addProperty.controls.square_footage.setValue(
          dataResponse.data.square_footage
        );
        this.addProperty.controls.property_image.setValue(
          dataResponse.data.property_image
        );
        this.addProperty.controls.client.setValue(dataResponse.data.client);
        //console.log(this.clients);
        this.croppedImage = dataResponse.data.property_image;

        for (var i = 0; i < this.clients.length; i++) {
          if (this.clients[i]._id == dataResponse.data.client) {
            var client = this.clients[i];
            this.groupName =
              client.firstname +
              " " +
              client.lastname +
              ", " +
              client.email +
              ", " +
              client.phone;
          }
        }

        this.loader = false;
      },
      (error) => {
        console.log(error);
        this.loader = false;
      }
    );
  }

  clearClient() {
    this.addProperty.controls.client.setValue("");
    //this.groupName = "Select client";
    this.translate
      .get("Property.AddProperty.Select client")
      .subscribe((text: string) => {
        //console.log(text);
        this.groupName = text;
        //this.CreditCardConfirmation = text;
        //console.log(text);
      });
  }

  selectClient(client) {
    //console.log(client);
    //this.client_id = client._id;
    this.addProperty.controls.client.setValue(client._id);
    this.groupName =
      client.firstname +
      " " +
      client.lastname +
      ", " +
      client.email +
      ", " +
      client.phone;
  }
  getUserInfo() {
    if (localStorage.getItem("currentUser")) {
      this.currentId = JSON.parse(localStorage.getItem("currentUser"))._id;
      if (this.requestNew) {
        this.requestNew.unsubscribe();
      }
      this.requestNew = this.dashboardapi
        .get_mls_user(this.currentId)
        .subscribe(
          (dataResponse) => {
            //console.log(dataResponse);
            dataResponse.data.roles.forEach((item) => {
              if (item.role == "member") {
                this.checkmember = true;
              }

              if (item.role == "mlsadmin") {
                this.checkmlsadmin = true;
              }

              if (item.role == "superadmin") {
                //this.loginFlag = false;
                //this.checkmlsadmin = false;
                this.checkSuperAdmin = true;
              }
            });
          },
          (error) => {
            console.log(error.status);
          }
        );
    }
  }

  getMlsids() {
    if (this.requestNew1) {
      this.requestNew1.unsubscribe();
    }

    this.requestNew1 = this.dashboardapi.get_mls_ids_member().subscribe(
      (dataResponse) => {
        this.mls_array = dataResponse.mls_id;
        var count = this.mls_array.length;
        var newcount = 0;
        this.mls_array.forEach((element) => {
          if (element.mls_id == this.nrSelect) {
            this.mlsName = element.mls_name;
            this.mls_isupload_select = element.mls_isupload;
            //console.log(this.mlsName);
          }
          newcount++;
        });
        if (count == newcount) {
          //console.log(newcount);
          //console.log(this.mlsName);
          if (this.mlsName == "" && this.mls_array.length > 0) {
            //console.log(this.mls_array[0]);
            this.mlsName = this.mls_array[0].mls_name;
            this.mls_isupload_select = this.mls_array[0].mls_isupload;
            localStorage.setItem("f_mls", this.mls_array[0].mls_id);
            localStorage.setItem(
              "f_mls_isupload",
              this.mls_array[0].mls_isupload
            );
          }
        }
        if (
          this.loginFlag &&
          this.router.url.split("/")[1] != "new-chart" &&
          this.router.url.split("/")[1] != "property-import-submit" &&
          this.router.url.split("/")[1] != "presentation" &&
          this.mls_isupload_select
        ) {
          this.floating = true;
        } else {
          this.floating = false;
        }
        //console.log(this.router.url.split('/')[1]);

        if (
          this.router.url.split("/")[1] == "chart" ||
          this.router.url.split("/")[1] == "investment-report"
        ) {
          this.showCurrency = true;
        }
        if (this.router.url.split("/")[1] == "presentation") {
          this.isActive = true;
        }

        if (this.redirect == true) {
          this.isActive = true;
        }

        //console.log( this.router.url.split('/')[1]  );
        //console.log(this.router.url);
        //console.log(this.router.url);
        this.route.params.subscribe((res) => {
          //console.log(res);

          this.currentId = res.id;
          //console.log(this.isActive);
        });
      },
      (error) => {}
    );
  }

  onGroup(mls) {
    //console.log(mls);
    this.mlsName = mls.mls_name;

    this.sharedMlsService.changeMlsId(mls.mls_id);
    localStorage.setItem("f_mls", mls.mls_id);
    localStorage.setItem("f_mls_isupload", mls.mls_isupload);
    this.intercomService.boot();
    this.currentUrl = this.router.url;
    //console.log(this.router.url);
    //console.log(this.nrSelect);
    //console.log(this.router.url.split('/')[1]);
    if (
      this.loginFlag &&
      this.router.url.split("/")[1] != "property-import-submit" &&
      this.router.url.split("/")[1] != "presentation" &&
      mls.mls_isupload == true
    ) {
      this.floating = true;
    } else {
      this.floating = false;
    }
    this.router.navigate(["/"]);
    //console.log(mls.mls_name);
    //console.log(this.mlsName);
  }

  mlsSwitch(mls_id) {
    //console.log(mls_id);
    localStorage.setItem("f_mls", mls_id);
    this.intercomService.boot();
    this.router.navigate(["/"]);
    //this.mlsEvent.emit(mls_id);
  }

  signout() {
    this.loginFlag = false;

    localStorage.removeItem("currentUser");
    if (localStorage.getItem("samlFlag") === "true") {
      console.log("Saml Active");
      localStorage.setItem("samlFlag", "false");
    } else {
      localStorage.removeItem("samlFlag");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("mls");
    localStorage.removeItem("f_mls");
    localStorage.removeItem("api");
    localStorage.removeItem("page");
    localStorage.removeItem("limit");
    localStorage.removeItem("searchText");
    localStorage.removeItem("sortBy");
    localStorage.removeItem("ascdesc");
    localStorage.removeItem("access_token");
    localStorage.removeItem("f_mls_isupload");
    localStorage.clear();
    this.intercomService.boot();
    this.router.navigate(["/login"]);
  }

  openFloating() {
    const dialogRef = this.dialog.open(PropertiesUploadComponent, {
      panelClass: "custom-dialog-container",
      data: {
        action: "Floating",
      },
      width: "45em",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log(result);
        this.router.navigate(["/property-import-submit/" + result]);
        //this.getReviewersList();
      }
    });
  }
}
