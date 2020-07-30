import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { CustomerComponent } from './customer/customer.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CartsComponent } from './carts/carts.component';
import { OrdersComponent } from './orders/orders.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  //{path: '', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  
  {path: 'superadmin', component: SuperadminComponent, canActivate: [AuthGuard]},
  {path: 'admins', component: AddAdminComponent, canActivate: [AuthGuard]},
  {path: 'customers', component: AddCustomerComponent, canActivate: [AuthGuard]} ,

  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'customer', component: CustomerComponent, canActivate: [AuthGuard]},
  {path: 'products', component: AddProductComponent, canActivate: [AuthGuard]},
  {path: 'carts', component: CartsComponent, canActivate: [AuthGuard]},
  {path: 'myorders', component: OrdersComponent, canActivate: [AuthGuard]},
  {path: '**',  redirectTo: '/login', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
