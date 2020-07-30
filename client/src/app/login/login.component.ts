import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false
  role = ''

  loginForm: FormGroup

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) {
      //this.navService.getLoginStatus().subscribe(
        //status => this.isLoggedIn = status
      //)
     }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    })
  }

  onSubmit() {
    //console.log(this.loginForm)
    /*this.auth.loginUser(this.loginForm.value).subscribe(
      res => {
        localStorage.setItem('token', res.token)
        if(res.user_role === 'superadmin') {
          localStorage.setItem('role', res.user_role)
          localStorage.setItem('currentUser', res.email)
          this.navService.updateNavAfterAuth(res.user_role)
          this.navService.updateLoginStatus(true)
          this.role = res.user_role
          this.router.navigate(['superadmin'])
        } else if(res.user_role === 'admin') {
          localStorage.setItem('role', res.user_role)
          localStorage.setItem('currentUser', res.email)
          this.navService.updateNavAfterAuth(res.user_role)
          this.navService.updateLoginStatus(true)
          this.role = res.user_role
          this.router.navigate(['admin'])
        } else if(res.user_role === 'customer') {
          localStorage.setItem('role', res.user_role)
          localStorage.setItem('currentUser', res.email)
          this.navService.updateNavAfterAuth(res.user_role)
          this.navService.updateLoginStatus(true)
          this.role = res.user_role
          this.router.navigate(['customer'])
        } else {
          this.router.navigate(['login'])
        }
      },
      err => console.log(err)
    )*/

    /*this.auth.loginUser(this.loginForm.value).subscribe(
      res => {
        localStorage.setItem('token', res.token)
        localStorage.setItem('role', res.user_role)
        localStorage.setItem('currentUser', res.email)
        var role = res.user_role
        if(role === 'superadmin') {
          this.router.navigate(['/superadmin'])
        }
        if(role === 'admin') {
          this.router.navigate(['/admin'])
        }
        if(role === 'customer') {
          this.router.navigate(['/customer'])
        }
      },
      err => console.log("MY ERROR : " + err)
    )
      
  }*/

  //used validate() of auth service before
  this.auth.loginUser(this.loginForm.value).then(
    (response)=>{
      this.auth.setUserInfo(response)
      if(response.user_role === 'superadmin') {
        this.router.navigate(['superadmin'])
      }
      if(response.user_role === 'admin') {
        this.router.navigate(['admin'])
      }
      if(response.user_role === 'customer') {
        this.router.navigate(['customer'])
      }
    }, (error) => {
      //console.log(error)
      if(error instanceof HttpErrorResponse){
        if(error.status === 400 ) {
          //console.log(error.error.message)
          //Unauthorized access
          alert(error.error.message)
          this.router.navigate(['register'])
        }
      }
    })
  }
}
