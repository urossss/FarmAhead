import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { MatStepperModule } from '@angular/material/stepper'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { FarmerOverviewComponent } from './farmer-overview/farmer-overview.component';
import { FarmerGardenComponent } from './farmer-garden/farmer-garden.component';
import { ShopOverviewComponent } from './shop-overview/shop-overview.component';
import { ShopProductComponent } from './shop-product/shop-product.component';
import { ShopCartComponent } from './shop-cart/shop-cart.component';
import { CompanyOrdersComponent } from './company-orders/company-orders.component';
import { CompanyProductsComponent } from './company-products/company-products.component';
import { CompanyStatsComponent } from './company-stats/company-stats.component';
import { AdminRequestsComponent } from './admin-requests/admin-requests.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FarmerAddGardenComponent } from './farmer-add-garden/farmer-add-garden.component';
import { CompanyAddProductComponent } from './company-add-product/company-add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    FarmerOverviewComponent,
    FarmerGardenComponent,
    ShopOverviewComponent,
    ShopProductComponent,
    ShopCartComponent,
    CompanyOrdersComponent,
    CompanyProductsComponent,
    CompanyStatsComponent,
    AdminRequestsComponent,
    AdminUsersComponent,
    AdminAddUserComponent,
    PageNotFoundComponent,
    ChangePasswordComponent,
    FarmerAddGardenComponent,
    CompanyAddProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
