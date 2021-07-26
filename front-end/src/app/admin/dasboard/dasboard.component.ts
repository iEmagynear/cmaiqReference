import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from "../../services/dashboard.service";
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { SelectItem } from 'primeng/api';
import { async } from 'q';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss'],
  providers:[DashboardService],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class DasboardComponent implements OnInit {

  selectedAll;
  value: Date;
  public addMls:boolean = false;
  public upload:boolean = false;
  public remove:boolean = false;
  public advanceSearch:boolean = false;
  userslength = 0;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  addMlsUser:any;
  users = [];
  currentDate;
  status: boolean = false;
  minimumDate = new Date();
  page = 1;
  limit = 10;
  totalpages = [];
  totalnumpages=0;
  loader = false;
  searchText;
  sortBy = 'created';
  ascdesc = 'desc';
  request;
  countUpload;
  countRemove;
  affectcount=0;
  error;
  affectcountr=0;
  errorr;
  submitted = false;
  //currentmlsid
  public menu = '../assets/icon/menu.png';
  s3_bucket: any;
  constructor(private formBuilder: FormBuilder,
    public api: DashboardService,
    private router:Router,
    private _eref: ElementRef) {
    this.validateAddMlsUserForm();
  }


  ngOnInit() {
    this.s3_bucket = environment.s3_bucket;

    //this.currentmlsid = localStorage.getItem('mls');
    let page = localStorage.getItem("page");
    let limit = localStorage.getItem("limit");
    let searchText = localStorage.getItem("searchText");
    let sortBy = localStorage.getItem("sortBy");
    let ascdesc = localStorage.getItem("ascdesc");

    if(page){

      this.page = Number(page);

    }

    if(limit){

      this.limit = Number(limit);

    }

    if(searchText){

      this.searchText = searchText;

    }

    if(sortBy){

      this.sortBy = sortBy;

    }

    if(ascdesc){

      this.ascdesc = ascdesc;

    }

    this.getAllUsers();

    localStorage.removeItem("page");
    localStorage.removeItem("limit");
    localStorage.removeItem("searchText");
    localStorage.removeItem("partnsortByerId");
    localStorage.removeItem("ascdesc");

  }

  toggle(){
    this.status = !this.status;
    if(this.status){
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 250 + 'px';
      this.menu = '../assets/icon/menu-open.png';
    }else{
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 80 + 'px';
      this.menu = '../assets/icon/menu.png';
    }
  }

  addMlsMember(){
    this.addMls = true;
  }

  advancedSearch(){
    this.advanceSearch = true;
  }

  closeMlsMember(){
    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.addMls = false;
    this.upload = false;
    this.remove = false;
    this.advanceSearch = false;
    this.submitted = false;
    this.addMlsUser.reset({
      'email': '',
      'firstname': '',
      'lastname': '',
      'market_center': '',
      'expiry': '',
      'wantsto':'',
      'wantstonotify':''
    });

  }

  onClick(event) {
    //console.log(event.target.className);
    if (event.target.className == 'MLSWrraper ng-star-inserted'){
      this.addMls = false;
      this.submitted =false;
      this.showMsgSuccess = false;
      this.addMlsUser.reset({
        'email': '',
        'firstname': '',
        'lastname': '',
        'market_center': '',
        'expiry': '',
        'wantsto':'',
        'wantstonotify':''
      });
    }
  }

  bulkUpload(){
    this.countUpload = 0;
    this.affectcount = 0;
    this.error = '';
    this.upload = true;
  }

  bulkRemove(){
    this.countRemove = 0;
    this.affectcountr = 0;
    this.errorr = '';
    this.remove = true;
  }

  validateAddMlsUserForm(){

    this.addMlsUser =  this.formBuilder.group({

      firstname: [''],
      lastname: [''],
      email: ['', [ Validators.maxLength(255),Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      expiry: [''],
      market_center:[''],
      wantsto:[],
      wantstonotify:[],
      payer_type_online:['Offline']
    });

  }

  get addUserFetch() {
    return this.addMlsUser.controls;

  }

  addMlsUserSubmit(){

    this.submitted = true;
    if (this.addMlsUser.invalid) {
      return;
    }
    this.submitted = false;
    this.showMsgSuccess = false;
    this.showMsgError = false;
    this.loader = true;
    const body = {
      'mls_id': localStorage.getItem('mls'),
      'firstname': this.addMlsUser.value.firstname,
      'lastname': this.addMlsUser.value.lastname,
      'email': this.addMlsUser.value.email,
      'expiry': this.addMlsUser.value.expiry,
      'market_center':this.addMlsUser.value.market_center,
      'wantsto': this.addMlsUser.value.wantsto,
      'wantstonotify': this.addMlsUser.value.wantstonotify,
      'payer_type_online':this.addMlsUser.value.payer_type_online
    };

    //console.log(body);

    this.api.add_mls_user(body).subscribe( (dataResponse) => {
      //await dataResponse;
      this.showMsgSuccess = true;
      this.getAllUsers();
      this.addMlsUser.reset({
        'firstname': '',
        'lastname': '',
        'email': '',
        'expiry': '',
        'market_center':'',
        'wantsto':'',
        'wantstonotify':'',
        'payer_type_online':''
      });
      this.loader = false;
    },
    (error)=>{
      this.showMsgError = true;
      //console.log(error);
      this.errormsg = error.message;
      this.loader = false;
    });
  }

  navigateToView(id) {

    localStorage.setItem("page", String(this.page));
    localStorage.setItem("limit",String(this.limit) );
    if(this.searchText){
      localStorage.setItem("searchText",String(this.searchText) );
    }
    localStorage.setItem("sortBy",(this.sortBy)?String(this.sortBy):null );
    localStorage.setItem("ascdesc",String(this.ascdesc) );

    this.router.navigate(["/edit-user-member/" + id ]);

  }

  getAllUsers(){
    this.loader = true;
    this.totalpages = [];
    this.totalnumpages = 0;
    this.users = [];
    this.userslength = 0;
    let default_mls = localStorage.getItem('mls');
    const body = {
      'mls_id': localStorage.getItem('mls'),
      'pageNumber': this.page,
      'maxRecords': this.limit,
      'searchText': this.searchText ? this.searchText : null,
      'sortBy': this.sortBy ? this.sortBy : null,
      'sortType': this.ascdesc ? this.ascdesc : null,
    };

    if(this.request){
      this.request.unsubscribe();
    }

    this.request = this.api.get_mls_users(body).subscribe(
    async (dataResponse) => {
      this.users = [];
      this.userslength = 0;
      //this.totalpages = dataResponse.totalpage;
      this.totalnumpages = await dataResponse.totalpage;

      this.totalpages = this.createRange(this.totalnumpages);

      //console.log(dataResponse);
      dataResponse.data.forEach(element => {

        //console.log(element.expiry);

        var expiry;

        if(element.expiry){
          expiry = element.expiry.split('T')[0]
        }

        let market_center = '';

        if(element.mls_specific_data){
          if(element.mls_specific_data[default_mls]){
            market_center = element.mls_specific_data[default_mls].market_center;
          }
        }
        let abc = '';
        element.roles.forEach((item) => {
          //console.log(item)
          if(item.role == 'member'){

              item.association.forEach((item1) => {

                // if(item1.payer_type_online != ''){
                //   element.abc =  item1.payer_type_online.toLowerCase();
                // }else{
                //   element.abc = '';
                // }

                if(item1.payer_type_online == 'true'){
                  // this.mlsapi.get_user_subscriptions_admin({ "f_mls": localStorage.getItem('mls'),"id":id }).subscribe((dataResponsesub) => {
                  //   //console.log(dataResponsesub);
                  //   if (dataResponsesub.payments) {
                  //    mn //this.activeplan = true;
                  //     let plan = dataResponsesub.payments.subscription_plan;
                  //     console.log(plan);
                  //
                  //     //console.log(plan.indexOf("group"));
                  //
                  //     if(plan.indexOf("group") > 0){
                  //       this.editMlsUser.controls.payer_type_online.setValue('Group');
                  //     }
                  //     else if(plan.indexOf("yearly") > 0){
                  //       this.editMlsUser.controls.payer_type_online.setValue('Individual');
                  //     }
                  //     else{
                  //       this.editMlsUser.controls.payer_type_online.setValue('Individual');
                  //     }
                  //
                  //   }
                  //
                  // },
                  // error => {
                  //   console.log(error)
                  // })
                }
                else if(item1.payer_type_online == 'false' || item1.payer_type_online == null){
                  element.payer_type_online =  'Pay Handled Offline';
                }
                else
                {
                  if(item1.payer_type_online.toLowerCase() == 'offline'){
                    element.payer_type_online =  'Pay Handled Offline';
                  }
                  else if(item1.payer_type_online.toLowerCase() == 'individual'){
                    element.payer_type_online =  'Pay Online Individual Plan';
                  }
                  else if(item1.payer_type_online.toLowerCase() == 'group'){
                    element.payer_type_online =  'Pay Online Group Plan';
                  }

                }
              });
            }
          });

        //console.log(element);
        this.users.push({
          'created':element.created,
          'firstname':element.firstname,
          'lastname':element.lastname,
          'email':element.email,
          'expiry':expiry,
          'payer_type_online':element.payer_type_online,
          'market_center':market_center,
          'updated':element.updated,
          '_id':element._id
        });
        //console.log(this.users);
      });


      this.userslength = dataResponse.total;
      this.loader = false;
      this.selectedAll = false;
      //console.log(this.users);
    },
    (error) => {
      this.loader = false;
    });
  }

  changePage(page){
    this.page = page;
    this.getAllUsers();
  }

  prevPage() {
    this.page = this.page - 1;
    this.getAllUsers();
  }

  nextPage() {
    this.page = this.page + 1;
    this.getAllUsers();
  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  sortByF(sortBy){
    //console.log(sortBy);
    this.sortBy = sortBy;
    if (this.ascdesc == "asc") {
      this.ascdesc = "desc";
    } else {
      this.ascdesc = "asc";
    }
    this.getAllUsers();
  }

  onChangeLimit(event) {
    this.page = 1;
    const limit = event.target.value;
    //console.log(limit);
    this.limit = limit;
    this.getAllUsers();
  }

  searchUser(text) {

    this.page = 1;
    this.searchText = text;
    this.getAllUsers();

  }

  softdelete(id){
    console.log(id)

    const body = {
      'mls_id': localStorage.getItem('mls'),
      'id': id,
    };

    if (confirm("Are you sure you want to remove this member?")) {
      this.loader = true;
      //console.log('if');
      this.api.delete_mls_users(body).subscribe(
        (dataResponse) => {

          //console.log(dataResponse);
          this.page = 1;
          this.getAllUsers();
        },
        (error) => {
          this.loader = false;
        });
    }
    else{
      //console.log('else');
    }
  }

  selectAll() {

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].selected = this.selectedAll;
    }

  }

  deleteMlsMember(){

    var array = [];
    this.users.forEach((element, index) => {
      if (element.selected) {

        array.push({
          _id: element._id,
          selected: element.selected
        });

      }
    });

    if(array.length > 0){
      if (confirm("Are you sure you want to remove these members?")) {
        array.forEach((element, index) => {
          //console.log(element);
          const body = {
            'mls_id': localStorage.getItem('mls'),
            'id': element._id,
          };
          this.api.delete_mls_users(body).subscribe(
            (dataResponse) => {
              //console.log(dataResponse);
              this.page = 1;
              this.getAllUsers();
            },
            (error) => {
              this.loader = false;
          });
        });
        this.selectedAll = false;
      }
    }
    else{
      alert('Select atleast one row.');
    }

  }

  myUploader(event,fileUpload,wantsto,notifynewmls):void{
    //console.log(wantsto);
    //console.log(notifynewmls);
    /* console.log(wantsto);
    return; */
    if(event.files.length == 0){

      //console.log('No file selected.');

      return;

    }

    var fileToUpload = event.files[0];

    const body = {
      file: fileToUpload,
      'mls_id': localStorage.getItem('mls'),
      'wantsto':wantsto,
      'wantstonotify':notifynewmls
    };

    if (confirm("Are you sure you want to upload these members?")) {
      this.loader = true;
      this.api.bulk_upload_members(body).subscribe(
        (dataResponse) => {
          /* countUpload;
          countRemove; */
          this.loader = false;
          this.countUpload = dataResponse.count;
          this.affectcount = dataResponse.affectcount;
          this.error = dataResponse.error.replace(/(^, )|(, $)/g, "");
          this.page = 1;
          //this.upload = false;
          fileUpload.clear();
          this.getAllUsers();
        },
        (error) => {
          this.loader = false;
      });
    }

  }

  myUploaderRemove(event,fileUpload){

    if(event.files.length == 0){

      //console.log('No file selected.');

      return;

    }

    var fileToUpload = event.files[0];

    const body = {
      file: fileToUpload,
      'mls_id': localStorage.getItem('mls'),
    };

    if (confirm("Are you sure you want to remove these members?")) {

      this.api.bulk_remove_members(body).subscribe(
        (dataResponse) => {
          this.countRemove = dataResponse.count;
          this.affectcountr = dataResponse.affectcount;
          this.errorr = dataResponse.error.replace(/(^, )|(, $)/g, "");
          this.page = 1;
          //this.remove = false;
          fileUpload.clear();
          this.getAllUsers();
        },
        (error) => {
          this.loader = false;
      });

    }

  }

  mlsEventHander($event: any){
    //console.log($event);

    this.getAllUsers();
  }

}
