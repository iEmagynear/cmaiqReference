import { Component, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown';
import { MlsService } from '../../services/mls.service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mls-setting',
  templateUrl: './mls-setting.component.html',
  styleUrls: ['./mls-setting.component.scss']
})
export class MlsSettingComponent implements OnInit, AfterViewInit {
  itemList = [];
  selectedItems = [];
  settings = {};
  public innerHeight;
  public listHeight;
  userForm: FormGroup;
  mlsData = [];
  loader = false;
  showMsgSuccess = false;
  showMsgError = false;
  errormsg;
  text;// = "Select MLS";
  @ViewChild('dropdownElem') dropdownElem: AngularMultiSelect;
  constructor(public translate: TranslateService,private formBuilder: FormBuilder, private api: MlsService) {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {

    if (screen.width < 767) {
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
  }

  ngAfterViewInit() {

  }

  ngOnInit() {

    this.selectedItems = [];

    //console.log(this.translate.currentLang);

    this.settings = {
      text: this.text,
      enableCheckAll: false,
      limitSelection: 1,
      classes: "myclass custom-class",
      enableSearchFilter: true,
      badgeShowLimit: 5
    };

    this.userForm = this.formBuilder.group({
      'mlsese': [[], Validators.required]
    });
    this.getMlsLists();
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('MLS Setting.Select MLS').subscribe( (text: string) => {
      this.text = text;
    });

  }

  getMlsLists() {
    this.loader = true;
    this.api.getMlsList()
      .subscribe((dataResponse) => {
        //console.log("Old Data: ", dataResponse);
        var mlsPreData = dataResponse;
        mlsPreData.sort(function(a, b) {
          var nameA = a.itemName.toLowerCase(), nameB = b.itemName.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        })
        //console.log("New Data: ", mlsPreData);
        this.mlsData = mlsPreData;
        //console.log("Final Data: ", this.mlsData)
        this.dropdownElem.openDropdown();
        //console.log(this.mlsData);
        this.loader = false;
      },
        (error) => {
          this.loader = false;
          console.log(error)
        });
  }

  submitForm() {
    let body = {
      mls: this.userForm.controls.mlsese.value
    }

    this.api.requestMls(body).subscribe((dataResponse) => {

      this.loader = false;
      this.showMsgSuccess = true;
      this.userForm.controls.mlsese.setValue([]);
    },
      (error) => {
        this.showMsgError = true;
        console.log(error);
        this.errormsg = error.message;
        this.loader = false;
      });
    //console.log(this.userForm.controls.mlsese.value);
  }

  onItemSelect(item: any) {
    /* console.log(item);
    console.log(this.selectedItems); */
  }

  OnItemDeSelect(item: any) {
    /* console.log(item);
    console.log(this.selectedItems); */
  }

}
