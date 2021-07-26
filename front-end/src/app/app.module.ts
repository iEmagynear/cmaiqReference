import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './frontend/home/home.component';
import { LoginComponent } from './frontend/login/login.component';
import { SignupComponent } from './frontend/signup/signup.component';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms'
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './frontend/header/header.component';
import { FooterComponent } from './frontend/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxNewstickerAlbeModule } from 'ngx-newsticker-albe';
import { DasboardComponent } from './admin/dasboard/dasboard.component';
import { MatButtonModule, MatSidenavModule, MatCheckboxModule, MatListModule, MatStepperModule, MatTabsModule, MatCardModule, MatFormFieldModule, MatNativeDateModule, MatOptionModule, MatSelectModule, MatMenuModule, MatIconModule, MatTableModule } from '@angular/material';
import { FileUploadModule } from 'primeng/fileupload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LeftSidebarComponent } from './admin/left-sidebar/left-sidebar.component';
import { EditUserMemberComponent } from './admin/edit-user-member/edit-user-member.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { HttpErrorInterceptor } from './services/http-error.interceptor';
import { ContactUsComponent } from './frontend/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './frontend/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './frontend/reset-password/reset-password.component';
import { TestimonialComponent } from './frontend/testimonial/testimonial.component';
import { CaseStudyComponent } from './frontend/case-study/case-study.component';
import { NewChartComponent } from './frontend/new-chart/new-chart.component';
import { ClientComponent } from './frontend/new-chart/client/client.component';
import { PropertyComponent } from './frontend/new-chart/property/property.component';
import { ComparableComponent } from './frontend/new-chart/comparable/comparable.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CropperModule } from 'ngx-cropper';
import { MaterialModule } from './material.modules';
import { DialogClientComponent } from './frontend/new-chart/dialog-client/dialog-client.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { ViewClientComponent } from './frontend/new-chart/view-client/view-client.component';
import { EditClientComponent } from './frontend/new-chart/edit-client/edit-client.component';
import { DialogPropertyComponent } from './frontend/new-chart/dialog-property/dialog-property.component';
import { ViewPropertyComponent } from './frontend/new-chart/view-property/view-property.component';
import { EditPropertyComponent } from './frontend/new-chart/edit-property/edit-property.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { EditProfileComponent } from './common/edit-profile/edit-profile.component';
import { FprofileComponent } from './frontend/fprofile/fprofile.component';
import { MlsSettingComponent } from './frontend/mls-setting/mls-setting.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { IntercomModule } from 'ng-intercom';
import { GenerateChartComponent } from './frontend/generate-chart/generate-chart.component';
import { MychartsComponent } from './frontend/mycharts/mycharts.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AdminDashboardComponent } from './superadmin/admin-dashboard/admin-dashboard.component';
import { EditAdminMlsComponent } from './superadmin/edit-admin-mls/edit-admin-mls.component';
import { MinusPipe } from './minus.pipe';
import { EditGroupMlsComponent } from './superadmin/edit-group-mls/edit-group-mls.component';
import { ChartjsComponent } from './frontend/chartjs/chartjs.component';
import { FlexmlsComponent } from './frontend/flexmls/flexmls.component';
import { ParagonComponent } from './frontend/paragon/paragon.component';
import { ParagonSubmitComponent } from './frontend/paragon/submit/paragon-submit.component';
import { ShibbolethComponent } from './frontend/shibboleth/shibboleth.component';
import { IntercomService } from './services/intercom.service';
import { PaymentComponent } from './frontend/payment/payment.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { SortByPipe } from './frontend/shared/sort.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ConvertPipe } from './pipes/convert.pipe'
import { EULAComponent } from './frontend/pdf-form/EULA/eula.component';
import { PrivacyComponent } from './frontend/pdf-form/Privacy/privacy.component';
import { TOAComponent } from './frontend/pdf-form/TOA/toa.component';
import { NoCommaPipe } from './pipes/nocomma.pipe';
import { ConfValuesComponent } from 'src/app/admin/conf-values/conf-values.component';
import { InvestmentAnalysisComponent } from './investment/investment-analysis/investment-analysis.component';
import { AnalysisComponent } from './investment/analysis/analysis.component';
import { InvestmentReportComponent } from './investment/investment-report/investment-report.component';
import { ChartsComponent } from './investment/investment-report/charts/charts.component';
import { AnalyticsComponent } from './investment/investment-report/analytics/analytics.component';
import { NotesComponent } from './investment/investment-report/notes/notes.component';
import { ReportsComponent } from './investment/investment-report/reports/reports.component';
import { CashFlowComponent } from './investment/investment-report/cash-flow/cash-flow.component';
import { AnnualInestmentAnalysisComponent } from './investment/investment-report/annual-inestment-analysis/annual-inestment-analysis.component';
import { AnnualizedReturnComponent } from './investment/investment-report/annualized-return/annualized-return.component';
import { TaxBenefitComponent } from './investment/investment-report/tax-benefit/tax-benefit.component';
import { PrincipalPaydownComponent } from './investment/investment-report/principal-paydown/principal-paydown.component';
import { HomeValueComponent } from './investment/investment-report/home-value/home-value.component';
import { HomeEquityComponent } from './investment/investment-report/home-equity/home-equity.component';
import { PresentationComponent } from './frontend/presentation/presentation.component';
import { ChartjsPresentationComponent } from './frontend/chartjs-presentation/chartjs-presentation.component';
import { ApcNewsManagerComponent } from './admin/apc-news-manager/apc-news-manager.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditNewsComponent } from './admin/edit-news/edit-news.component';
import { PropertiesUploadComponent } from './frontend/properties-upload/properties-upload.component';
import { OmpPropertiesUploadComponent } from './frontend/omp-properties-upload/omp-properties-upload.component';
import { PropertyImportSubmitComponent } from './frontend/property-import-submit/property-import-submit.component';
import { NewClientComponent } from './frontend/new-chart/new-client/new-client.component';
import { ProspectingComponent } from './frontend/new-chart/prospecting/prospecting.component';
import { FacebookModule } from 'ngx-facebook';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider,
} from "angular-6-social-login";

import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { OmpComponent } from './frontend/new-chart/omp/omp.component';
import { SlidePanelComponent } from './frontend/new-chart/slide-panel/slide-panel.component';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { DialogPropertyPopupComponent } from './frontend/new-chart/dialog-property-popup/dialog-property-popup.component';

//import { PdfViewerComponent } from 'ng2-pdf-viewer';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json?v=' + Date.now());
  //return new TranslateHttpLoader(httpClient,
  //environment.feServerUrl + '/assets/i18n/', '.json');
}

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {}

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
	        provider: new FacebookLoginProvider("1528937850637252")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
	        provider: new GoogleLoginProvider("755910481088-i1dgd8fccrui03aeq9ibu36v3k0f94bl.apps.googleusercontent.com")
        }/* ,
        {
          id: LinkedinLoginProvider.PROVIDER_ID,
          provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
        } */
      ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    DasboardComponent,
    LeftSidebarComponent,
    EditUserMemberComponent,
    AdminHeaderComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TestimonialComponent,
    CaseStudyComponent,
    NewChartComponent,
    ClientComponent,
    PropertyComponent,
    ComparableComponent,
    DialogClientComponent,
    ViewClientComponent,
    EditClientComponent,
    DialogPropertyComponent,
    ViewPropertyComponent,
    EditPropertyComponent,
    ProfileComponent,
    EditProfileComponent,
    FprofileComponent,
    MlsSettingComponent,
    GenerateChartComponent,
    MychartsComponent,
    AdminDashboardComponent,
    EditAdminMlsComponent,
    MinusPipe,
    EditGroupMlsComponent,
    ChartjsComponent,
    FlexmlsComponent,
    ParagonComponent,
    ParagonSubmitComponent,
    ShibbolethComponent,
    PaymentComponent,
    SortByPipe,
    EULAComponent,
    PrivacyComponent,
    TOAComponent,
    //PdfViewerComponent,
    ConvertPipe,
    ConfValuesComponent,
    InvestmentAnalysisComponent,
    AnalysisComponent,
    InvestmentReportComponent,
    NoCommaPipe,
    ChartsComponent,
    AnalyticsComponent,
    NotesComponent,
    ReportsComponent,
    CashFlowComponent,
    AnnualInestmentAnalysisComponent,
    AnnualizedReturnComponent,
    TaxBenefitComponent,
    PrincipalPaydownComponent,
    HomeValueComponent,
    HomeEquityComponent,
    PresentationComponent,
    ChartjsPresentationComponent,
    ApcNewsManagerComponent,
    EditNewsComponent,
    PropertiesUploadComponent,
    OmpPropertiesUploadComponent,
    PropertyImportSubmitComponent,
    NewClientComponent,
    ProspectingComponent,
    OmpComponent,
    SlidePanelComponent,
    DialogPropertyPopupComponent
  ],
  imports: [
    CarouselModule,
    BrowserModule,
    //PdfViewerComponent,
    NgxMaskModule.forRoot(options),
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // CarouselModule.forRoot(),
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatCardModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    FileUploadModule,
    MatDatepickerModule,
    TextMaskModule,
    CropperModule,
    MaterialModule,
    ImageCropperModule,
    AngularMultiSelectModule,
    ChartsModule,
    NgbModule,
    NgxNewstickerAlbeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCINatvnaI7hDPvDYsQp853W4ed4rJYZq4', // 'AIzaSyBcWd6CoqjN1zSBFUB0u9gBy7hfaaSXlik',
      libraries: ['places', 'drawing', 'geometry']
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
    }),
    IntercomModule.forRoot({
      appId: 'psa4d174', // from your Intercom config
      updateOnRouterChange: true // will automatically run `update` on router event changes. Default: `false`
    }),
    NgxStripeModule.forRoot(environment.stripe_pk),
    CreditCardDirectivesModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CKEditorModule,
    AnimateOnScrollModule.forRoot(),
    JwSocialButtonsModule,
    FacebookModule.forRoot(),
    SocialLoginModule
  ],
  entryComponents: [
    DialogClientComponent,
    DialogPropertyComponent,
    DialogPropertyPopupComponent,
    OmpComponent,
    OmpPropertiesUploadComponent,
    NewClientComponent,
    ProspectingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthGuard, // IntercomService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    SortByPipe,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
    //GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
