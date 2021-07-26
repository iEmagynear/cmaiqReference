import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apc-news-manager',
  templateUrl: './apc-news-manager.component.html',
  styleUrls: ['./apc-news-manager.component.scss']
})
export class ApcNewsManagerComponent implements OnInit {

  status: boolean = false;
  addNews = false;
  public Editor = ClassicEditor;
  public addNewsForm: any;
  loader = false;
  showMsgSuccess = false;
  showMsgError=false;
  errormsg;
  news;
  constructor(private router:Router,private formBuilder: FormBuilder,public superAdminApi: DashboardService,) { }

  ngOnInit() {
    this.validateAddMlsSuperAdmin();
    this.getNews();
  }

  toggle(){
    this.status = !this.status;
    if(this.status){
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 250 + 'px';
    }else{
      (document.querySelector('.mat-drawer-content') as HTMLElement).style.marginLeft = 80 + 'px';
    }
  }
  
  validateAddMlsSuperAdmin() {
    this.addNewsForm = this.formBuilder.group({
      title: [''],
      content: [''],
    });
  }

  getNews(){

    this.loader = true;
    //console.log(body);

    this.superAdminApi.get_news().subscribe( (dataResponse) => {
      // await dataResponse;
      console.log(dataResponse);
      this.news = dataResponse;
      this.loader = false;
      //this.showMsgSuccess = false;
      this.showMsgError = false;
    },
    (error) => {
      //this.showMsgError = true;
      console.log(error);
      this.loader = false;
    });

  }

  addNew() {
    this.addNews = true;
  }

  closeaddNew() {
    this.addNews = false;
  }

  deleteNews(id){
    console.log(id);
    const body = {
      'id': id,
    };

    if (confirm("Are you sure you want to remove this news?")) {
      this.loader = true;
      //console.log('if');
      this.superAdminApi.delete_news(body).subscribe(
        (dataResponse) => {

          //console.log(dataResponse);
          //this.page = 1;
          this.getNews();
        },
        (error) => {
          this.loader = false;
        });
    }
    else{
      //console.log('else');
    }
  }

  navigateToView(id) {
    this.router.navigate(["/admin/apc-news-manager/edit-news/" + id ]);
  }

  addNewsFormSubmit(){
    const body = {
      'title': this.addNewsForm.value.title,
      'content': this.addNewsForm.value.content,
    };
    this.loader = true;
    //console.log(body);

    this.superAdminApi.add_news(body).subscribe( (dataResponse) => {
      // await dataResponse;
      this.showMsgSuccess = true;
      // this.getAllUsers();
      this.getNews();
      this.addNewsForm.reset({
        'title': '',
        'content': '',
      });

      this.loader = false;
      //this.showMsgSuccess = false;
      this.showMsgError = false;
    },
    (error) => {
      this.showMsgError = true;
      // console.log(error);
      this.errormsg = error.message;
      this.loader = false;
    });
    
  }

}
