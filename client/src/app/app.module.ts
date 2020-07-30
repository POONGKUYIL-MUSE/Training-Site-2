import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NavbarService } from './navbar.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';

import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { SuperadminComponent } from './superadmin/superadmin.component';
import { AdminComponent } from './admin/admin.component';
import { CustomerComponent } from './customer/customer.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddProductComponent } from './add-product/add-product.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { CartsComponent } from './carts/carts.component';
import { OrdersComponent } from './orders/orders.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SuperadminComponent,
    AdminComponent,
    CustomerComponent,
    AddAdminComponent,
    AddCustomerComponent,
    AddProductComponent,
    DialogBoxComponent,
    CartsComponent,
    OrdersComponent,
    CustomSnackbarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    SuperadminComponent,
    AdminComponent,
    CustomerComponent,
    AddAdminComponent,
    AddCustomerComponent,
    AddProductComponent,
    DialogBoxComponent,
    OrdersComponent,
    CartsComponent
  ],
  providers: [AuthService, AuthGuard, NavbarService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
