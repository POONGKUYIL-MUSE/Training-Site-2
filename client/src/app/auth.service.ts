import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private snackbar: MatSnackBar;
  private _registerUrl = "http://localhost:3000/api/register"
  private _loginUrl = "http://localhost:3000/api/login"
  private _getAdminUrl = "http://localhost:3000/api/getAdmins"
  private _getCustomerUrl = "http://localhost:3000/api/getCustomers"
  private _editUserUrl = "http://localhost:3000/api/editUser/"
  private _delUserUrl = "http://localhost:3000/api/delUser/"
  private _addUserUrl = "http://localhost:3000/api/addUser"
  private _getProductsUrl = "http://localhost:3000/api/getProducts"
  private _addProductUrl = "http://localhost:3000/api/addProduct/"
  private _editProductUrl = "http://localhost:3000/api/editProduct/"
  private _delProductUrl = "http://localhost:3000/api/delProduct/"
  private _addCartUrl = "http://localhost:3000/api/addCart/"
  private _getCartUrl = "http://localhost:3000/api/getCart/"
  private _addOrderUrl = "http://localhost:3000/api/addOrder"
  private _getOrderUrl = "http://localhost:3000/api/getOrder/"
  private _getAllOrderUrl = "http://localhost:3000/api/getAllOrders"

  public superadmin = false
  public admin = false
  public customer = false

  constructor(private http: HttpClient,
    private router: Router) { }

  getAllAdmins() {
      return this.http.get<any>(this._getAdminUrl)
  }

  getAllCustomers() {
    return this.http.get<any>(this._getCustomerUrl)
  }
  
  getAllProducts() {
    return this.http.get<any>(this._getProductsUrl)
  }

  editUser(user, cid) {
   return this.http.put<any>(this._editUserUrl+cid, user) 
  }

  addUser(user){
    return this.http.post<any>(this._addUserUrl, user)
  }

  delUser(cid) {
    return this.http.delete<any>(this._delUserUrl+cid)
  }

  addProduct(product, cuser) {
    return this.http.post<any>(this._addProductUrl+cuser, product)
  }

  editProduct(product, cid) {
    return this.http.put<any>(this._editProductUrl+cid, product)
  }

  delProduct(cid){
    return this.http.delete<any>(this._delProductUrl+cid)
  }

  addCart(row, cuser){
    return this.http.post<any>(this._addCartUrl+cuser, row)
  }

  addOrder(data){
    return this.http.post<any>(this._addOrderUrl, data)
  }

  getCart(cuser){
    return this.http.get<any>(this._getCartUrl+cuser)
  }

  getOrder(cuser) {
    return this.http.get<any>(this._getOrderUrl+cuser)
  }

  getAllOrders() {
   return this.http.get<any>(this._getAllOrderUrl)
  }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user)
  }

  loginUser(user) {
    //return this.http.post<any>(this._loginUrl, user)
    return this.http.post<any>('http://localhost:3000/api/authenticate', {'username': user.email, 'password': user.password}).toPromise()
  }

  getToken() {
  	return localStorage.getItem('token')
  }

  superadminCheck() {
    let role = localStorage.getItem('role')
    if(role === 'superadmin'){
      this.superadmin = true
      return true
    }
    return false
  }

  adminCheck() {
    let role = localStorage.getItem('role')
    if(role === 'admin') {
      this.admin = true
      return true
    }
    return false
  }

  customerCheck() {
    let role = localStorage.getItem('role')
    if(role === 'customer') {
      this.customer = true
      return true
    }
    return false
  }

  loggedIn() {
    return !!localStorage.getItem('token')
  }

  logoutUser() {
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('username')
    this.router.navigate(['login'])
  }

  public isAuthenticated(): boolean {
    let userData = localStorage.getItem('token')
    if(userData) {
      return true
    }
    else {
      return false
    }
    
  }

  public setUserInfo(user) {
    localStorage.setItem('currentUser', user.email)
    localStorage.setItem('username', user.name)
    localStorage.setItem('token', user.token)
    localStorage.setItem('role', user.user_role)
  }

  public validate(user){ 
    return this.http.post('http://localhost:3000/api/authenticate', {'username': user.email, 'password': user.password}).toPromise()
  }




  /*
  * SNACK BAR
  */
  openSnackBar(message){
    this.snackbar.openFromComponent(CustomSnackbarComponent, {
      duration: 2000,
      data: message
    })
  }  
}
