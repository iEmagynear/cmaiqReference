import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { StatusService } from 'src/app/services/status.service';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-properties-upload',
  templateUrl: './omp-properties-upload.component.html',
  styleUrls: ['./omp-properties-upload.component.scss']
})
export class OmpPropertiesUploadComponent implements OnInit {

  loader = false;
  maxCount = 249;
  genChartButtonError = false;
  MaximumResultsExceeded;
  MaximumResultsExceededtext;
  MinimumResultsError;
  MinimumResultsErrortext;
  public innerHeight;
  popuptitle: string;
  popuptitletext: string;

  constructor(private router: Router,
    public translate: TranslateService,
    private api: ChartService,
    public statusService: StatusService,
    public dialogRef: MatDialogRef<OmpPropertiesUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  @HostListener('window:resize')
  onResize() {

    if (screen.width < 767) {
    } else {
      this.innerHeight = (window.innerHeight) - 135 + 'px';
    }
  }

  ngOnInit() {
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate.get('Sign Out.Maximum Results Exceeded_import').subscribe((text: string) => {
      this.MaximumResultsExceeded = text;
    });

    this.translate.get('Sign Out.Maximum Results Exceededtext_import').subscribe((text: string) => {
      this.MaximumResultsExceededtext = text;
    });

    this.translate.get('Sign Out.Minimum Results Error').subscribe((text: string) => {
      this.MinimumResultsError = text;
    });

    this.translate.get('Sign Out.Minimum Results Errortext').subscribe((text: string) => {
      this.MinimumResultsErrortext = text;
    });

    this.translate.get('Sign Out.CSV File Import').subscribe((text: string) => {
      this.popuptitle = text;
    });

    this.translate.get('Sign Out.Are you sure you want to import this CSV file?').subscribe((text: string) => {
      this.popuptitletext = text;
    });

  }

  myUploader(event, fileUpload): void {

    if (event.files.length == 0) {

      return;

    }

    var fileToUpload = event.files[0];

    const body = {
      file: fileToUpload,
      'mls_id': localStorage.getItem('f_mls'),
    };

    Swal.fire({
      title: this.popuptitle,
      html: '<h6>' + this.popuptitletext + '</h6>',
      width: '42em',
      showCancelButton: true,
      cancelButtonText: 'CANCEL',
      confirmButtonText: 'CONFIRM',
    }).then((result) => {
      if (result.value) {
        this.loader = true;

        this.api.omp_properties_import(body).subscribe((dataRes) => {

          //console.log(dataRes);

          if (dataRes.jsondata) {
            this.dialogRef.close(dataRes);
          }

        },
          (error) => {
            this.loader = false;
            //console.log(error);
            if (error.errorType == 1) {
              //this.genChartButtonError = true;
              Swal.fire({
                title: this.MaximumResultsExceeded,
                html: '<h6>' + this.MaximumResultsExceededtext + '<h6>',
                width: '42em'
              });
            } else if (error.errorType == 2) {
              //this.genChartButtonError = true;
              Swal.fire({
                title: this.MinimumResultsError,
                html: '<h6>' + this.MinimumResultsErrortext + '<h6>',
                width: '42em'
              });
            } else if (error.errorType == 3) {
              //this.genChartButtonError = true;
              Swal.fire({
                title: this.MaximumResultsExceeded,
                html: '<h6>' + this.MaximumResultsExceededtext + '<h6>',
                width: '42em'
              });
            } else if (error.errorType == 4) {

              let errorhtml = "<ul>";

              for (var key in error.error) {
                if (error.error.hasOwnProperty(key)) {

                  var val = error.error[key];

                  errorhtml = errorhtml + "<li>Invalid data found in " + key + " column.</li>"
                }
              }

              errorhtml = errorhtml + "</ul>";

              Swal.fire({
                title: "CSV Data Mismatch",
                html: errorhtml,
                width: '42em',
                customClass: 'datamismatch'
              });
            }
            else if (error.errorType == 5) {

              let errorhtml = "<ul>";

              error.error.forEach(element => {

                errorhtml = errorhtml + "<li>" + element + "</li>"

              });

              errorhtml = errorhtml + "</ul>";

              Swal.fire({
                title: "CSV Data Mismatch",
                html: errorhtml,
                width: '42em',
                customClass: 'datamismatch'
              });
            }
            fileUpload.clear();
          });
      }

    });


  }

}
