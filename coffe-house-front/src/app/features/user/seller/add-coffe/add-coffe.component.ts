import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SellerService} from '../../../../core/services/users/seller.service';
import {Coffee} from '../../../../core/model/coffee';

@Component({
  selector: 'app-add-coffe',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-coffe.component.html',
  styleUrl: './add-coffe.component.scss'
})
export class AddCoffeComponent {

  addForm : FormGroup;
  isSubmitted = false ;
  errorMessage = "";
  selectedFile: File | null = null;

  constructor(private service : SellerService , private fb : FormBuilder) {

     this.addForm = this.fb.group({
       name : ['' ,[Validators.required]],
       type : ['' , [Validators.required]],
       description : ['' , [Validators.required]],
       price : ['',[Validators.required]],
       image : ['' ,[Validators.required]]
     })
  }

  get f(){return this.addForm.controls;}

  onFileSelected(event :any ){
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.addForm.patchValue({ image: file.name });
    }
  }

  onSubmit (){
    this.isSubmitted = true ;

    if (this.addForm.valid && this.selectedFile){

      const formData = new FormData();
      formData.append('name', this.f['name'].value);
      formData.append('description', this.f['description'].value);
      formData.append('type', this.f['type'].value);
      formData.append('price', this.f['price'].value);
      formData.append('image', this.selectedFile);

      this.service.addCoffeWithFormData(formData).subscribe({
        next:()=>{
          alert("adding coffee successful");
          this.addForm.reset();
          this.isSubmitted = false;
      },error: err => {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }



}
