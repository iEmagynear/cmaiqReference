import { HomeComponent } from './frontend/home/home.component';
import { LoginComponent } from './frontend/login/login.component';
import { SignupComponent } from './frontend/signup/signup.component';
import { DasboardComponent } from './admin/dasboard/dasboard.component';
import { EditUserMemberComponent } from './admin/edit-user-member/edit-user-member.component';
import { AuthGuard } from './auth/auth.guard';
import { ContactUsComponent } from './frontend/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './frontend/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './frontend/reset-password/reset-password.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { GuardsCheckEnd } from '@angular/router';
import { TestimonialComponent } from './frontend/testimonial/testimonial.component';
import { CaseStudyComponent } from './frontend/case-study/case-study.component';
import { NewChartComponent } from './frontend/new-chart/new-chart.component';
import { ClientComponent } from './frontend/new-chart/client/client.component';
import { PropertyComponent } from './frontend/new-chart/property/property.component';
import { ComparableComponent } from './frontend/new-chart/comparable/comparable.component';
import { ViewClientComponent } from './frontend/new-chart/view-client/view-client.component';
import { EditClientComponent } from './frontend/new-chart/edit-client/edit-client.component';
import { ViewPropertyComponent } from './frontend/new-chart/view-property/view-property.component';
import { EditPropertyComponent } from './frontend/new-chart/edit-property/edit-property.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { FprofileComponent } from './frontend/fprofile/fprofile.component';
import { MlsSettingComponent } from './frontend/mls-setting/mls-setting.component';
import { GenerateChartComponent } from './frontend/generate-chart/generate-chart.component';
import { MychartsComponent } from './frontend/mycharts/mycharts.component';
import { AdminDashboardComponent } from './superadmin/admin-dashboard/admin-dashboard.component'
import { EditAdminMlsComponent } from './superadmin/edit-admin-mls/edit-admin-mls.component';
import { EditGroupMlsComponent } from './superadmin/edit-group-mls/edit-group-mls.component';
import { FlexmlsComponent } from './frontend/flexmls/flexmls.component';
import { ParagonComponent } from './frontend/paragon/paragon.component';
import { ShibbolethComponent } from './frontend/shibboleth/shibboleth.component';
import { PaymentComponent } from './frontend/payment/payment.component';
import { ParagonSubmitComponent } from './frontend/paragon/submit/paragon-submit.component';
import { EULAComponent } from './frontend/pdf-form/EULA/eula.component';
import { PrivacyComponent } from './frontend/pdf-form/Privacy/privacy.component';
import { TOAComponent } from './frontend/pdf-form/TOA/toa.component';
import { InvestmentAnalysisComponent } from './investment/investment-analysis/investment-analysis.component';
import { AnalysisComponent } from './investment/analysis/analysis.component';
import { InvestmentReportComponent } from './investment/investment-report/investment-report.component';
import { ConfValuesComponent } from 'src/app/admin/conf-values/conf-values.component';
import { PresentationComponent } from './frontend/presentation/presentation.component';
import { ApcNewsManagerComponent } from './admin/apc-news-manager/apc-news-manager.component';
import { EditNewsComponent } from './admin/edit-news/edit-news.component';
import { PropertiesUploadComponent } from './frontend/properties-upload/properties-upload.component';
import { OmpPropertiesUploadComponent } from './frontend/omp-properties-upload/omp-properties-upload.component';
import { PropertyImportSubmitComponent } from './frontend/property-import-submit/property-import-submit.component';
import { NewClientComponent } from './frontend/new-chart/new-client/new-client.component';
import { ProspectingComponent } from './frontend/new-chart/prospecting/prospecting.component';
import { OmpComponent } from './frontend/new-chart/omp/omp.component'
export const routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'my-account/profile', component: FprofileComponent, canActivate: [AuthGuard] },
  { path: 'my-account/mls-setting', component: MlsSettingComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: DasboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin/conf-values', component: ConfValuesComponent, canActivate: [AuthGuard] },
  { path: 'admin/apc-news-manager', component: ApcNewsManagerComponent, canActivate: [AuthGuard] },
  { path: 'admin/apc-news-manager/edit-news/:id', component: EditNewsComponent, canActivate: [AuthGuard] },

  { path: "edit-user-member/:id", component: EditUserMemberComponent, canActivate: [AuthGuard] },
  //{ path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'contact', component: ContactUsComponent },
  { path: 'testimonial', component: TestimonialComponent },
  { path: 'case-studies', component: CaseStudyComponent },
  { path: 'new-chart/property-value-analysis', component: ComparableComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/property-value-analysis/:id', component: ComparableComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/property-value-analysis/:id/:redirect', component: ComparableComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/property-value-analysis/:id/:redirect/:sqft', component: ComparableComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/property-value-analysis/:id/:redirect/:sqft/:title', component: ComparableComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/client', component: ClientComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/property', component: PropertyComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/comparable', component: ComparableComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/view-client', component: ViewClientComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/view-property', component: ViewPropertyComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/edit-client/:id', component: EditClientComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/edit-property/:id', component: EditPropertyComponent, canActivate: [AuthGuard] },
  { path: 'new-chart/:id', component: ComparableComponent, canActivate: [AuthGuard] },
  { path: 'chart/:id', component: GenerateChartComponent },
  { path: 'chart/:id/:redirect', component: GenerateChartComponent },
  { path: 'chart/:id/:redirect/:client_id', component: GenerateChartComponent },
  { path: 'mycharts', component: MychartsComponent, canActivate: [AuthGuard] },
  { path: 'property-import', component: PropertiesUploadComponent, canActivate: [AuthGuard] },
  { path: 'property-import-submit/:id', component: PropertyImportSubmitComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'edit-admin-mls/:id', component: EditAdminMlsComponent, canActivate: [AuthGuard] },
  { path: 'edit-group-mls/:id', component: EditGroupMlsComponent, canActivate: [AuthGuard] },
  { path: 'apc/:path', component: FlexmlsComponent },
  { path: 'new/:path', component: ParagonComponent },
  { path: 'paragonSubmit', component: ParagonSubmitComponent },
  { path: 'shibboleth', component: ShibbolethComponent },
  { path: 'shibboleth/:redis_token/:mlsname', component: ShibbolethComponent },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'investment-analysis', component: InvestmentAnalysisComponent, canActivate: [AuthGuard] },
  { path: 'analysis', component: AnalysisComponent, canActivate: [AuthGuard] },
  { path: 'analysis/:id', component: AnalysisComponent, canActivate: [AuthGuard] },
  { path: 'analysis/:id/:redirect', component: AnalysisComponent, canActivate: [AuthGuard] },
  { path: 'investment-report/:id', component: InvestmentReportComponent },
  { path: 'eula', component: EULAComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'toa', component: TOAComponent },
  { path: 'presentation/:id', component: PresentationComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },

];
