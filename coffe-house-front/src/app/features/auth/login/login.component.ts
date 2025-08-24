import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {LoginData} from '../../../core/model/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule , ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm : FormGroup;
  isSubmitted = false;

  constructor( private fb : FormBuilder ,
               private service :AuthService,
               private router : Router
               ) {
    this.loginForm = this.fb.group({
      email : ['',[Validators.required , Validators.email]],
      password : ['' , [Validators.required]]
    })
  }

  get f(){return this.loginForm.controls;}

  onSubmit(){
    this.isSubmitted = true ;
    if (this.loginForm.valid){
      const logindata:LoginData = {
        email : this.f['email'].value,
        password : this.f['password'].value
      };
      this.service.loginUser(logindata).subscribe({
        next: (res)=> {
          console.log('Login success:', res);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login error:', err);
        }
      })
    }
  }

}
