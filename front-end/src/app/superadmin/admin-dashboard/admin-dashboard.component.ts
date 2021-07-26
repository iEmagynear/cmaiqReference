import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { PagerService } from '../../services/pager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  providers: [DashboardService]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  activeTab: string;
  tabStatus = false;
  mlsUpdatedSubscription: Subscription;
  public status: boolean = false;
  public addMls: boolean = false;
  minimumDate = new Date();
  adminuserslength = 0;
  adminMlsGroupLength = 0;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  addMlsUser: any;
  adminUsers = [];
  currentDate;
  page = 1;
  limit = 10;
  totalpages = [];
  totalnumpages = 0;
  loader = false;
  searchText;
  searchTextGroup;
  namelength = 0;
  sortBy = 'created';
  ascdesc = 'desc';
  request;
  countUpload;
  countRemove;
  affectcount = 0;
  error;
  affectcountr = 0;
  errorr;
  submitted = false;
  currentmlsid;
  selectedAll;
  confirmmsg: string;
  confirmDailog: boolean = false;
  mlsGroup = [];
  public showmulti = false;
  public mlsData = [];
  public addMlsSuperAdmin: any;
  public memberListShow: boolean = false;
  public selectedItems2 = [];
  public settings = {};
  pager: any = {};
  // paged items
  pagedItems: any[];
  public totalRecords;
  public totalGroupRecords;
  public menu = '../assets/icon/menu.png';
  showMlsFlag: boolean;
  showRoleFlag: boolean;
  constructor(private route: ActivatedRoute, private pagerService: PagerService, private formBuilder: FormBuilder,
    public superAdminApi: DashboardService, private router: Router) { }

  ngOnInit() {
    this.currentmlsid = localStorage.getItem('f_mls');
    //console.log(this.currentmlsid);
    // this.getGroupMls();
    //this.getAdminUsers();
    this.totalpages = [];
    this.totalnumpages = 0;
    let page = localStorage.getItem("page");
    let limit = localStorage.getItem("limit");
    let searchText = localStorage.getItem("searchText");
    let searchTextGroup = localStorage.getItem("searchTextGroup");
    let sortBy = localStorage.getItem("sortBy");
    let ascdesc = localStorage.getItem("ascdesc");
    if (page) {
      this.page = Number(page);
    }
    if (limit) {
      this.limit = Number(limit);
    }
    if (searchText) {

      this.searchText = searchText;

    }
    if (searchTextGroup) {

      this.searchTextGroup = searchTextGroup;

    }
    localStorage.removeItem("page");
    localStorage.removeItem("limit");
    localStorage.removeItem("searchText");
    localStorage.removeItem("searchTextGroup");
    localStorage.removeItem("partnsortByerId");
    localStorage.removeItem("ascdesc");

    this.validateAddMlsSuperAdmin();
    this.settings = {
      text: "Select MLS",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      enableSearchFilter: true,
      maxHeight: 200,
      badgeShowLimit: 2,
    };

    this.route.queryParams.subscribe((params) => {
      this.activeTab = params.activeTab;
      if (params.activeTab == 'mlsGroupTab') {
        this.getGroupMls();
      }
      else {
        this.getAdminUsers();
      }
      //this. validateFlexmlsForm();
    });


  }

  ngAfterViewInit() {

  }

  toggle() {

    this.status = !this.status;
    if (this.status) {
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 250 + 'px';
      this.menu = '../assets/icon/menu-open.png';
    } else {
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 80 + 'px';
      this.menu = '../assets/icon/menu.png';
    }
  }

  getAdminUsers() {
    this.loader = true;
    // this.totalpages = [];
    // this.totalnumpages = 0;
    this.adminUsers = [];
    this.adminuserslength = 0;
    this.adminMlsGroupLength = 0;
    let default_mls = localStorage.getItem('f_mls');
    //console.log(default_mls);
    const body = {
      'mls_id': localStorage.getItem('f_mls'),
      'pageNumber': this.page,
      'maxRecords': this.limit,
      'searchText': this.searchText ? this.searchText : null,
      'sortBy': this.sortBy ? this.sortBy : null,
      'sortType': this.ascdesc ? this.ascdesc : null,
    };
    //console.log(body.mls_id);
    if (this.request) {
      this.request.unsubscribe();
    }

    this.request = this.superAdminApi.get_admin_mls_users(body).subscribe(
      async (dataResponse) => {
        //this.adminUsers = [];
        this.adminuserslength = 0;
        this.adminMlsGroupLength = 0;
        this.totalpages = dataResponse.totalpage;
        this.totalnumpages = await dataResponse.totalpage;
        this.totalRecords = dataResponse.total;
        this.totalpages = this.createRange(this.totalnumpages);
        // console.log(this.totalpages);
        //console.log(dataResponse);
        this.pager = this.pagerService.getPager(this.totalRecords, this.page, this.limit);
        dataResponse.data.forEach(element => {

          //console.log(element.expiry);

          var expiry;

          if (element.expiry) {
            expiry = element.expiry.split('T')[0]
          }

          let market_center = '';

          if (element.mls_specific_data) {
            if (element.mls_specific_data[default_mls]) {
              market_center = element.mls_specific_data[default_mls].market_center;
            }
          }
          //console.log(element)
          this.adminUsers.push({
            'created': element.created,
            'firstname': element.firstname,
            'lastname': element.lastname,
            'email': element.email,
            'mls_name': element.mlsname,
            'roles': element.roles,
            'created_date': element.created,
            'updated_date': element.updated,
            '_id': element._id,
            'mls_id': element.mls_id
          });
        });
        //console.log(this.adminUsers)
        this.adminuserslength = dataResponse.total;
        this.adminMlsGroupLength = dataResponse.mlsTotal;
        this.loader = false;
        this.selectedAll = false;
        //let data = this.adminUsers.find(ob => ob['mls_id']);
        // console.log(this.adminUsers.find(ob => ob['mls_id']));
      },
      (error) => {
        this.loader = false;
      });

    //this.getGroupMls();
  }

  searchUser(text) {

    this.page = 1;
    this.searchTextGroup = text;
    this.getGroupMls();

  }

  searchAllUser(text) {

    this.page = 1;
    this.searchText = text;
    this.getAdminUsers();

  }

  getGroupMls() {

    this.loader = true;
    this.mlsGroup = [];
    this.namelength = 0;
    const body = {
      'mls_id': localStorage.getItem('f_mls'),
      'searchText': this.searchTextGroup ? this.searchTextGroup : null,
      'groupPageNumber': this.page,
      'groupMaxRecords': this.limit,
      'groupSortBy': this.sortBy ? this.sortBy : null,
      'groupSortType': this.ascdesc ? this.ascdesc : null,
    };


    if (this.request) {
      this.request.unsubscribe();
    }
    this.request = this.superAdminApi.get_mlsgroup_superadmin(body).subscribe(
      async (dataResponse) => {
        this.mlsGroup = [];
        this.namelength = 0;
        this.totalpages = dataResponse.totalpage;
        this.totalGroupRecords = dataResponse.total;
        this.totalnumpages = await dataResponse.totalpage;

        this.totalpages = this.createRange(this.totalnumpages);

        //console.log(dataResponse);
        this.pager = this.pagerService.getPager(this.totalGroupRecords, this.page, this.limit);
        dataResponse.data.forEach(element => {
          this.mlsGroup.push({
            'group_name': element.name,
            'api_name': element.chart_api,
            'created_date': element.created,
            'updated_date': element.updated,
            'enableCSVUpload': element.enableCSVUpload,
            '_id': element._id,
          });
        });
        this.namelength = dataResponse.total;
        this.loader = false;

        this.adminuserslength = dataResponse.userTotal;
        this.adminMlsGroupLength = dataResponse.total;
      },
      (error) => {
        this.loader = false;
      });

  }

  clearTab() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} });
    this.getAdminUsers();
  }

  changePage(page) {
    this.page = page;
    this.pager = this.pagerService.getPager(this.totalRecords, this.page, this.limit);
    this.getAdminUsers();
  }
  changeGroupPage(page) {
    this.page = page;
    this.pager = this.pagerService.getPager(this.totalGroupRecords, this.page, this.limit);
    this.getGroupMls();
  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  onChangeLimit(event) {
    this.page = 1;
    const limit = event.target.value;
    console.log(limit);
    this.limit = limit;
    this.getAdminUsers();
  }

  onChangeGroupLimit(event) {
    this.page = 1;
    const limit = event.target.value;
    console.log(limit);
    this.limit = limit;
    this.getGroupMls();
  }


  deleteSingleAdminUser(id, mls_id) {
    console.log(id)

    const body = {
      'mls_id': mls_id,
      'id': id,
    };
    console.log(body.mls_id);
    //this.confirmmsg = "Are you sure you want to remove this member?";
    //this.confirmDailog = true;
    if (confirm("Are you sure you want to remove this member?")) {
      this.loader = true;
      //console.log('if');
      this.superAdminApi.delete_mls_users(body).subscribe(
        (dataResponse) => {
          //console.log(dataResponse);
          this.page = 1;
          this.getAdminUsers();
        },
        (error) => {
          this.loader = false;
        });
    }
    else {
      this.confirmDailog = false;
      //console.log('else');
    }
  }

  deleteMultiAdminUser() {

    var array = [];
    this.adminUsers.forEach((element, index) => {
      if (element.selected) {
        //console.log(element.mls_id);
        array.push({
          _id: element._id,
          mls_id: element.mls_id,
          selected: element.selected
        });

      }
    });

    if (array.length > 0) {
      if (confirm("Are you sure you want to remove these members?")) {
        array.forEach((element, index) => {
          //console.log(element);
          const body = {
            'mls_id': element.mls_id,
            'id': element._id,
          };
          //console.log(body);
          this.superAdminApi.delete_mls_users(body).subscribe(
            (dataResponse) => {
              //console.log(dataResponse);
              this.page = 1;
              this.getAdminUsers();
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

  selectAll() {
    for (let i = 0; i < this.adminUsers.length; i++) {
      this.adminUsers[i].selected = this.selectedAll;
    }
  }

  navigateToView(id) {

    localStorage.setItem("page", String(this.page));
    localStorage.setItem("limit", String(this.limit));
    if (this.searchText) {
      localStorage.setItem("searchText", String(this.searchText));
    }
    if (this.searchTextGroup) {
      localStorage.setItem("searchTextGroup", String(this.searchTextGroup));
    }
    localStorage.setItem("sortBy", (this.sortBy) ? String(this.sortBy) : null);
    localStorage.setItem("ascdesc", String(this.ascdesc));

    this.router.navigate(["/edit-admin-mls/" + id]);

  }

  navigateToMlsGroup(id) {

    //localStorage.setItem("page", String(this.page));
    //localStorage.setItem("limit",String(this.limit) );
    // if (this.searchText) {
    //   localStorage.setItem("searchText", String(this.searchText));
    // }
    localStorage.setItem("sortBy", (this.sortBy) ? String(this.sortBy) : null);
    localStorage.setItem("ascdesc", String(this.ascdesc));

    this.router.navigate(["/edit-group-mls/" + id]);

  }

  checkValue($event) {
    //console.log($event.currentTarget.checked);
    this.showmulti = $event.currentTarget.checked;
    if ($event.currentTarget.checked == false) {
      this.showMlsFlag = false;
      this.showRoleFlag = false;
    }
  }

  validateAddMlsSuperAdmin() {
    this.addMlsSuperAdmin = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.maxLength(255), Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      expiry: [''],
      mlsList2: [[]],
      mls_admin: [''],
      super_admin: [''],
      wantsto: ['']
    });
  }

  get addUserFetch() {
    return this.addMlsSuperAdmin.controls;

  }

  addMlsSuperAdminSubmit() {
    // debugger;
    this.showMlsFlag = false;
    this.showRoleFlag = false;
    this.submitted = true;
    this.getAdminUsers();
    if (this.addMlsSuperAdmin.invalid) {
      return;
    }
    this.submitted = false;
    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.loader = true;

    const newRoleAssocArray2 = [];
    //console.log(this.addMlsSuperAdmin.controls.mlsList2.value);
    if (this.addMlsSuperAdmin.controls.mlsList2.value) {
      this.addMlsSuperAdmin.controls.mlsList2.value.forEach(function (item2) {
        newRoleAssocArray2.push({
          "mls_id": item2.id
        });
      });
    }
    const newRoleArray = [];

    if (this.addMlsSuperAdmin.controls.mls_admin.value) {

      newRoleArray.push({
        "role": 'mlsadmin',
        "association": newRoleAssocArray2
      });
    }

    if (this.addMlsSuperAdmin.controls.super_admin.value) {

      newRoleArray.push({
        "role": 'superadmin',
        "association": []
      });
    }

    if (this.showmulti) {
      //console.log(this.addMlsSuperAdmin.controls['mlsList2']);
      if (this.addMlsSuperAdmin.controls['mlsList2'].value.length == 0) {
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

    const body = {
      'firstname': this.addMlsSuperAdmin.value.firstName,
      'lastname': this.addMlsSuperAdmin.value.lastName,
      'email': this.addMlsSuperAdmin.value.email,
      'expiry': this.addMlsSuperAdmin.value.expiry,
      'roles': newRoleArray,
      'wantsto': this.addMlsSuperAdmin.value.wantsto,
    };

    //console.log(body);

    this.superAdminApi.add_mls_superAdmin_user(body).subscribe((dataResponse) => {
      // await dataResponse;
      this.showMsgSuccess = true;
      // this.getAllUsers();
      this.addMlsSuperAdmin.reset({
        'firstname': '',
        'lastname': '',
        'email': '',
        'expiry': '',
        'roles': '',
        'wantsto': '',

      });
      this.loader = false;
      this.showMsgSuccess = false;
      this.showmulti = false;
      this.showRoleFlag = false;
      this.showMlsFlag = false;
    },
      (error) => {
        this.showMsgError = true;
        // console.log(error);
        this.errormsg = error.message;
        this.loader = false;
      });

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
    this.superAdminApi.get_mlslist_superadmin().subscribe((dataResponse) => {
      //console.log(dataResponse)
      this.mlsData = dataResponse.data;
      //console.log(this.mlsData);
      //this.getMlsMember(this.currentId);
      this.loader = false;
    },
      (error) => {
        this.loader = false;
        //console.log(error)
      });
  }

  sortByF(sortBy) {
    //console.log(sortBy);
    this.sortBy = sortBy;
    if (this.ascdesc == "asc") {
      this.ascdesc = "desc";
    } else {
      this.ascdesc = "asc";
    }
    this.getAdminUsers();
  }

  closeConfirm() {
    this.confirmDailog = false;
  }
  addMlsMember() {
    this.addMls = true;
    this.getMlsLists();
  }
  closeMlsMember() {
    //console.log(this.addMlsSuperAdmin.value.email);

    //this.addMlsSuperAdmin.reset();
    this.addMls = false;
    this.showmulti = false;
    this.showMlsFlag = false;
    this.showRoleFlag = false;
    this.addMlsSuperAdmin.reset({
      'firstname': '',
      'lastname': '',
      'email': ' ',
      'roles': '',
      'wantsto': '',
    });
  }

  onItemSelect1(item: any) {
    /* console.log(item);
    console.log(this.selectedItems1); */
  }

  OnItemDeSelect1(item: any) {
    /* console.log(item);
    console.log(this.selectedItems1); */
  }

  onItemSelect2(item: any) {
    this.showMlsFlag = false;
    this.showRoleFlag = false;
    /* console.log(item);
    console.log(this.selectedItems2); */
  }

  OnItemDeSelect2(item: any) {
    /* console.log(item);
    console.log(this.selectedItems2); */
  }
}
