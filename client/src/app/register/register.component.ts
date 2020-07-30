import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

  registrationForm: FormGroup;

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      cfpassword: ['', Validators.required]
    })
  }
  error:string = ''
  onSubmit() {
    if(this.registrationForm.value.password !== this.registrationForm.value.cfpassword){
      this.error = "Passwords does not match"
    }
    else {
      this.error = ''
      this.auth.registerUser(this.registrationForm.value).subscribe(
        response => {
          this.router.navigate(['login'])
        },
        err => console.log(err)
      )
    }
  }
}
