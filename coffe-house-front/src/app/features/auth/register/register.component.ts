import { Component } from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { User } from '../../../core/model/user';
import {RegisterData} from '../../../core/model/auth';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule ,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm : FormGroup;
  roles : string[] = ['seller' , 'client'];
  isSubmitted = false;
  errorMessage = "";


  constructor( private fb : FormBuilder, private service : AuthService) {
    this.registerForm = this.fb.group({
      full_name:['', Validators.required],
      email : ['', [Validators.required , Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword : ['',Validators.required],

      phone: [''],
      address: [''],
      description: [''],

    })
  }

  get f(){return this.registerForm.controls;}

   onSubmit():void{

      this.isSubmitted = true;
      this.errorMessage="";

      if(this.registerForm.invalid){
        return;
      }
      if (this.f['role'].value == 'client') {
        const user: RegisterData = {
          full_name: this.f['full_name'].value,
          email: this.f['email'].value,
          role: this.f['role'].value,
          password: this.f['password'].value,
          confirm_password: this.f['confirmPassword'].value

        };

        this.service.registerUser(user).subscribe({
          next: () => {
            alert("registration successful");
            this.registerForm.reset();
            this.isSubmitted = false;
          },
          error: err => {
            this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          }
        });
      }else{
        const user: RegisterData = {
          full_name: this.f['full_name'].value,
          email: this.f['email'].value,
          role: this.f['role'].value,
          password: this.f['password'].value,
          confirm_password: this.f['confirmPassword'].value,

          phone_number : this.f['phone'].value,
          address : this.f['address'].value,
          description : this.f['description'].value

        };

        this.service.registerSeller(user).subscribe({
          next: () => {
            alert("registration successful");
            this.registerForm.reset();
            this.isSubmitted = false;
          },
          error: err => {
            this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          }
        });
      }
   }



}
