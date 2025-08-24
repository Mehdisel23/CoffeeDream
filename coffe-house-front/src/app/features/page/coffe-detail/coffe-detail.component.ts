import {Component, OnInit} from '@angular/core';
import {CoffeeService} from '../../../core/services/coffee.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Coffee} from '../../../core/model/coffee';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-coffe-detail',
  imports: [CommonModule],
  templateUrl: './coffe-detail.component.html',
  styleUrl: './coffe-detail.component.scss'
})
export class CoffeDetailComponent implements OnInit{

  coffee? : Coffee;
  imagePreview: string | null = null;
  coffeeForm !: FormGroup ;

  constructor(private service : CoffeeService ,  private route: ActivatedRoute ,
              private fb : FormBuilder) {
  }

  ngOnInit(): void {
      this.initForm();
      this.showCoffeeDetail();
    }

    initForm(){

      this.coffeeForm = this.fb.group({
        name : ['' ,Validators.required],
        type: ['' , Validators.required],
        description : ['' , Validators.required],
        image : ['' , Validators.required],
        price : ['' , Validators.required],
        restaurant : ['' , Validators.required]
     })
    }

  showCoffeeDetail(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(id);

    this.service.getCoffeDetailById(id).subscribe(
      {next : (response) =>{
          console.log(response);
          this.imagePreview = `http://localhost:8000${response.data.image}`
          console.log(this.imagePreview)
          this.coffee = response.data ;

          console.log("this your coffee " , this.coffee);

        }
      }
    )
  }
}
