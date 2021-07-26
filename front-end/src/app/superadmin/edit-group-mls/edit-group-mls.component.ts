import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';



@Component({
  selector: 'app-edit-group-mls',
  templateUrl: './edit-group-mls.component.html',
  styleUrls: ['./edit-group-mls.component.scss'],
  providers: [DatePipe]
})
export class EditGroupMlsComponent implements OnInit {

  public currentId: any;
  public editMemberGroup: FormGroup;
  public loader = false;
  public editMlsGroupSingleName: any;
  public showMsgSuccess = false;
  public showMsgError = false;
  public errormsg;
  public status: boolean = false
  public isFileUploadCheck: boolean = false
  public isStatusCheck: boolean = false
  public nrSelect;
  public chartapi_array;
  public showServerId = false;
  constructor(private api: DashboardService, private formBuilder: FormBuilder, public route: ActivatedRoute, private datePipe: DatePipe, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.currentId = res.id;
      //console.log(this.currentId);
      //this.validateAddMlsUserForm(this.currentId);
      this.getMlsGroupMember(this.currentId);
    });

    this.validateeditMemberGroup();
  }

  toggle() {
    this.status = !this.status;
    if (this.status) {
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 250 + 'px';
    } else {
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 80 + 'px';
    }
  }

  validateeditMemberGroup() {
    this.editMemberGroup = this.formBuilder.group({
      _id: [''],
      name: [''],
      chart_api: [''],
      enableCSVUpload: [''],
      status: [''],
      alias: [''],
      server_id: [''],
      hasRental: ['']
    })
  }

  enableServerId(val) {
    console.log('checking val' + val)
    if (val && val != '') {
      this.editMemberGroup.controls.server_id.enable();
    }
    else
      this.editMemberGroup.controls.server_id.disable();
  }

  getMlsGroupMember(id) {
    this.loader = true;
    var lookup = {};
    var result = [];

    const body = {
      'mls_id': localStorage.getItem('f_mls'),
    };
    this.api.get_mlsgroup_superadmin(body).subscribe(
      (dataResponse) => {
        //let default_mls = localStorage.getItem('mls');
        //console.log(dataResponse.data, 'test');

        for (let i = 0; i < dataResponse.data.length; i++) {
          var name = dataResponse.data[i].chart_api;
          if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(name);
          }
        }

        this.chartapi_array = result.filter(n => n !== null && n !== undefined && n !== '');
        for (let i = 0; i < dataResponse.data.length; i++) {

          if (dataResponse.data[i]._id === id) {
            this.editMlsGroupSingleName = dataResponse.data[i];
            //console.log(this.editMlsGroupSingleName,'dataTest');
            break;
          }
        }

        this.enableServerId(this.editMlsGroupSingleName.chart_api);
        this.editMemberGroup.controls._id.setValue(this.editMlsGroupSingleName._id);
        this.editMemberGroup.controls.name.setValue(this.editMlsGroupSingleName.name);
        this.editMemberGroup.controls.chart_api.setValue(this.editMlsGroupSingleName.chart_api);
        this.editMemberGroup.controls.enableCSVUpload.setValue(this.editMlsGroupSingleName.enableCSVUpload);
        this.editMemberGroup.controls.status.setValue(this.editMlsGroupSingleName.status);
        this.editMemberGroup.controls.alias.setValue(this.editMlsGroupSingleName.alias);
        this.editMemberGroup.controls.server_id.setValue(this.editMlsGroupSingleName.server_id);
        this.editMemberGroup.controls.hasRental.setValue(this.editMlsGroupSingleName.hasRental);
        this.loader = false;
      },
      (error) => {
        console.log(error);
        this.loader = false;
      });
  }

  editMlsGroupSubmit() {
    this.showMsgSuccess = false;
    this.showMsgError = false;
    const body = {
      'name': this.editMemberGroup.value.name,
      'chart_api': this.editMemberGroup.value.chart_api,
      'mls_id': this.editMemberGroup.value._id,
      'enableCSVUpload': this.editMemberGroup.value.enableCSVUpload,
      'status': this.editMemberGroup.value.status,
      'alias': this.editMemberGroup.value.alias,
      'server_id': this.editMemberGroup.value.server_id,
      'hasRental': this.editMemberGroup.value.hasRental
    };
    this.api.edit_mls_superadmin(body).subscribe((dataResponse: any) => {
      if (dataResponse) {
        localStorage.setItem('f_mls_isupload', this.editMemberGroup.value.enableCSVUpload);

        //this.router.navigate(['/admin'])
        this.router.navigate(['/admin'], { queryParams: { activeTab: 'mlsGroupTab' } });

      }
      //this.showMsgSuccess = true;

    },
      (error) => {
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      });
  }

}
