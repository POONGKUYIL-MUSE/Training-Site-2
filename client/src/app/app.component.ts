import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import  { Router } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { CustomerComponent } from './customer/customer.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddProductComponent } from './add-product/add-product.component';
import { OrdersComponent } from './orders/orders.component';
import { CartsComponent } from './carts/carts.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  links: Array<{text: string, path: string}>
  isLoggedIn = false

  constructor(public authService: AuthService,
    private router: Router){
      this.router.config.unshift(
        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'superadmin', component: SuperadminComponent},
        {path: 'admin', component: AdminComponent},
        {path: 'customer', component: CustomerComponent},
        {path: 'admins', component: AddAdminComponent},
        {path: 'customers', component: AddCustomerComponent},
        {path: 'products', component: AddProductComponent},
        {path: 'carts', component: CartsComponent},
        {path: 'myorders', component: OrdersComponent}
      )
  }

  ngOnInit(){
    
  }

  logout() {
    localStorage.removeItem('role')
    localStorage.removeItem('currentUser')
    this.router.navigate(['login'])
  }

}
