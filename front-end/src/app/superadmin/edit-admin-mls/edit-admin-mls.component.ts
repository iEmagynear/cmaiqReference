import { Component, OnInit, ViewChild, OnDestroy, Injectable, Inject } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-edit-admin-mls',
  templateUrl: './edit-admin-mls.component.html',
  styleUrls: ['./edit-admin-mls.component.scss'],
  providers: [DatePipe]
})
@Injectable()
export class EditAdminMlsComponent implements OnInit, OnDestroy {

  showmulti = false;
  public currentId: any;
  public status: boolean = false;
  public loader = false;
  //public editMlsMember: FormGroup;
  public editMember: FormGroup;
  public showMsgSuccess = false;
  public showMsgError = false;
  public errormsg;
  public memberListShow: boolean = false;
  public mlsData = [];
  //public selectedItems1 = [];
  public selectedItems2 = [];
  public settings = {};
  /* dropdownList = [];
  selectedItems = [];
  dropdownSettings = {}; */

  @ViewChild('dropdownElem') dropdownElem: AngularMultiSelect;
  showMlsFlag: boolean;
  showRoleFlag: boolean;

  constructor(private api: DashboardService, private formBuilder: FormBuilder, private datePipe: DatePipe, public route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit() {

    this.route.params.subscribe(res => {
      this.currentId = res.id;

      //console.log(this.currentId);
      this.validateAddMlsUserForm(this.currentId);
      this.getMlsLists();
      //this.showmulti = true;

    });

    this.settings = {
      text: "Select MLS",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      enableSearchFilter: true,
      badgeShowLimit: 2,
      maxHeight: 200,
      position: 'top'
    };
    //  const mlsdd = this.document.getElementsByTagName('body')[0];
    //  mlsdd.classList.add('Dropdown_overflow');     
    //  console.log(mlsdd.className); 
    this.document.body.classList.add('Dropdown_overflow');
  }
  ngOnDestroy(): void {
    this.document.body.classList.remove('Dropdown_overflow');
  }
  toggle() {
    this.status = !this.status;
    if (this.status) {
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 250 + 'px';
    } else {
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 80 + 'px';
    }
  }

  memberList(event) {
    if (event.target.checked) {
      this.memberListShow = true;
      this.showRoleFlag = false;
    } else {
      this.memberListShow = false;
    }
  }

  getMlsLists() {
    this.loader = true;
    this.api.get_mlslist_superadmin().subscribe((dataResponse) => {
      // console.log(dataResponse)
      this.mlsData = dataResponse.data;
      //console.log(this.mlsData);
      this.getMlsMember(this.currentId);
      this.loader = false;
    },
      (error) => {
        this.loader = false;
        console.log(error)
      });
  }


  onItemSelect1(item: any) {
    // console.log(item);
    // console.log(this.selectedItems2);
  }

  OnItemDeSelect1(item: any) {
    // console.log(item);
    // console.log(this.selectedItems2);
  }

  onItemSelect2(item: any) {
    this.showMlsFlag = false;
    this.showRoleFlag = false;
    // console.log(item);
    // console.log(this.selectedItems2);
  }

  OnItemDeSelect2(item: any) {
    // console.log(item);
    // console.log(this.selectedItems2);
  }

  getMlsMember(id) {
    this.loader = true;
    this.api.get_mls_user(id).subscribe(
      (dataResponse) => {

        this.editMember.controls.firstname.setValue(dataResponse.data.firstname);
        this.editMember.controls.lastname.setValue(dataResponse.data.lastname);
        this.editMember.controls.email.setValue(dataResponse.data.email);

        //console.log(dataResponse.data.roles);
        dataResponse.data.roles.forEach((item) => {
          //console.log(item);
          if (item.role == 'mlsadmin') {

            if (item.association.length > 0) {
              this.showmulti = true;
              this.editMember.controls.mls_admin.setValue(true);
            }

            item.association.forEach((item1) => {
              //console.log("_id-"+item1.mls_id);
              //console.log(this.mlsData);

              for (var i = 0; i < this.mlsData.length; i++) {
                //console.log(this.mlsData[i].id);
                //console.log(item1.mls_id);

                if (this.mlsData[i].id == item1.mls_id) {
                  //console.log('in');

                  this.selectedItems2.push({
                    "id": this.mlsData[i].id,
                    "itemName": this.mlsData[i].itemName
                  });

                }
              }

            });

            //console.log(this.selectedItems2);

            this.editMember.controls.mlsList2.setValue(this.selectedItems2);
          }

          if (item.role == 'superadmin') {
            //console.log(item.association.length);
            //if(item.association.length > 0){
            this.editMember.controls.super_admin.setValue(true);
            //}
          }

          if (item.role != 'mlsadmin' && item.role != 'superadmin' && item.role != 'member') {
            this.showmulti = true;
            this.editMember.controls.mls_admin.setValue(true);
          }
        });
        this.loader = false;
      },
      (error) => {
        console.log(error);
        this.loader = false;

      });
  }

  validateAddMlsUserForm(currentId) {

    this.editMember = this.formBuilder.group({
      _id: [currentId],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.maxLength(255), Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      /* member: [''],
      mlsList1: [[]], */
      mls_admin: [''],
      mlsList2: [[]],
      super_admin: [''],
      //expiry1: [''],
      //expiry2: [''],
    })

  }

  checkValue($event) {
    //console.log($event.currentTarget.checked);
    this.showmulti = $event.currentTarget.checked;
    if ($event.currentTarget.checked == false) {
      this.showMlsFlag = false;
      this.showRoleFlag = false;
    }
  }

  editMlsMemberSubmit() {
    this.loader = true;
    this.showMlsFlag = false;
    this.showRoleFlag = false;
    let newRoleAssocArray2 = [];
    //console.log(this.editMember.controls.mlsList2.value);

    this.editMember.controls.mlsList2.value.forEach(function (item2) {
      newRoleAssocArray2.push({
        "mls_id": item2.id
      });
    });

    let newRoleArray = [];

    if (this.editMember.controls.mls_admin.value) {

      newRoleArray.push({
        "role": 'mlsadmin',
        "association": newRoleAssocArray2
      });
    }

    if (this.editMember.controls.super_admin.value) {

      newRoleArray.push({
        "role": 'superadmin',
        "association": []
      });
    }

    const body = {
      '_id': this.editMember.value._id,
      'firstname': this.editMember.value.firstname,
      'lastname': this.editMember.value.lastname,
      'roles': newRoleArray
    };

    //console.log(body);
    //return false;
    if (this.showmulti) {
      //console.log(this.addMlsSuperAdmin.controls['mlsList2']);
      if (this.editMember.controls['mlsList2'].value.length == 0) {
        this.loader = false;
        this.showMlsFlag = true;
        return;
      }
      else {
        this.showMlsFlag = false;
      }
    }

    if (newRoleArray.length == 0) {
      this.loader = false;
      this.showRoleFlag = true;
      return;
    }
    else {
      this.showRoleFlag = false;
    }
    this.api.edit_mls_member_superadmin(body).subscribe((dataResponse) => {
      //console.log(dataResponse);
      this.showMsgSuccess = true;
      this.showMlsFlag = false;
      this.showRoleFlag = false;
      this.loader = false;
    },
      (error) => {
        this.loader = false;
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
      });

  }

}
