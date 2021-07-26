import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss']
})
export class EditNewsComponent implements OnInit {

  status: boolean = false;
  addNews = false;
  public Editor = ClassicEditor;
  public editNewsForm: any;
  loader = false;
  showMsgSuccess = false;
  showMsgError=false;
  errormsg;
  news;
  currentId;

  constructor(public route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,public superAdminApi: DashboardService,) { }

  ngOnInit() {

    this.route.params.subscribe(res => {
      this.currentId = res.id;
      //console.log(this.currentId);
      this.validateAddMlsSuperAdmin();
      this.getNews(this.currentId);

    });

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
    this.editNewsForm = this.formBuilder.group({
      title: [''],
      content: [''],
    });
  }

  getNews(id){

    this.loader = true;
    console.log(id);

    this.superAdminApi.get_news_by_id(id).subscribe( (dataResponse) => {
      // await dataResponse;
      console.log(dataResponse);
      this.editNewsForm.controls.title.setValue(dataResponse.data.title);
      this.editNewsForm.controls.content.setValue(dataResponse.data.content);
      //this.news = dataResponse;
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
  //editNewsFormSubmit
  editNewsFormSubmit(){
    const body = {
      '_id':this.currentId,
      'title': this.editNewsForm.value.title,
      'content': this.editNewsForm.value.content,
    };
    this.loader = true;
    console.log(body);

    this.superAdminApi.edit_news(body).subscribe((dataResponse) => {
      console.log(dataResponse);
      this.showMsgSuccess = true;
      this.loader = false;
    },
    (error)=>{
      this.loader = false;
      this.showMsgError = true;
      console.log(error);
      this.errormsg = error.message;
    });

    /* this.superAdminApi.add_news(body).subscribe( (dataResponse) => {
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
    }); */
    
  }

}
