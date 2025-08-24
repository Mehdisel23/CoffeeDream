import {Component, OnInit} from '@angular/core';
import {SellerProfile, User} from '../../../../core/model/user';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SellerService} from '../../../../core/services/users/seller.service';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {CoffeeService} from '../../../../core/services/coffee.service';
import {Coffee} from '../../../../core/model/coffee';

@Component({
  selector: 'app-sellerprofile',
  imports: [
    ReactiveFormsModule , CommonModule
  ],
  templateUrl: './sellerprofile.component.html',
  styleUrl: './sellerprofile.component.scss'
})
export class SellerprofileComponent  implements  OnInit{


  profileForm!: FormGroup;
  seller ?: SellerProfile;
  loading = false ;
  message = "";
  image : File | null = null ;
  imagePreview: string | null = null;
  showModal = false ;
  coffee : Coffee[] = [];
  currentPage = 1;
  totalPages =0 ;
  totalCount = 0;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;

  constructor(private service: SellerService , private coffeService : CoffeeService , private fb : FormBuilder ,
              private router:Router) {
  }

  ngOnInit(): void {

        this.initForm();
        this.loadProfiles();
        this.getTheListCoffePerProfile();
    }

  initForm() {
    this.profileForm = this.fb.group({
      full_name: ['', Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      phone_number: [''],
      address: [''],
      description: [''],
      image : [''],

    });
  }

    loadProfiles (){

    this.loading = true ;
    this.service.sellerProfile().subscribe({
      next : (data)=> {
        console.log('Loaded seller data:', data);
        console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        this.seller= data ;

        /*if (this.seller.image && !this.seller.image.startsWith('http')) {
          this.seller.image = this.baseUrl + this.seller.image;
        }*/
       this.imagePreview = `http://localhost:8000${data.image}`;

       console.log(data.image);
       console.log(data.full_name);

        this.profileForm.patchValue({
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number || '',
          address: data.address || '',
          description: data.description || '',
          image : data.image || '',
        });
        this.loading = false;
      } ,
      error: () => {
        this.message = 'Failed to load profile.';
        this.loading = false;
        this.router.navigate(["/unau"]);
      }
    })
  }

  onImageSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.image = file;
      this.profileForm.patchValue({ image: file.name });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    this.service.chooseImageProfile(file).subscribe({
      next: (response) => {
        this.message = 'Image uploaded successfully!';
        // Reload profile to get updated image URL
        this.loadProfiles();
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.message = 'Failed to upload image.';
      }
    });
  }

  closeModal(){

  }
  get f(){return this.profileForm.controls;}
  onSubmit(){
    const  data : SellerProfile ={
      full_name : this.f['full_name'].value,
      email: this.f['email'].value,
      address : this.f['address'].value,
      phone_number : this.f['phone_number'].value,
      description: this.f['description'].value
    };
    this.service.updateSellerProfile(data).subscribe({
        next: () => {
        alert("registration successful");
        this.profileForm.reset();
        this.showModal = false;
      }
    },
  )
  }

  onShowModal(){
    this.showModal= true ;
  }


  getTheListCoffePerProfile(page : number =1){
    this.loading = true ;
    this.coffeService.getAddedCoffeePerUser(page).subscribe({
      next :
        (data) =>{
        console.log("this is data from the coffee api" , data);
        if(data && data.results && Array.isArray(data.results)){
          this.coffee = data.results ;
          this.currentPage = page ;
          this.totalCount = data.count ||0 ;
          this.nextPageUrl = data.next ;
          this.prevPageUrl = data.previous ;

        }else{
          console.error('Unexpected data structure:', data);
          this.coffee = [];
          this.message = 'Invalid data received from server';
        }
        this.loading = false ;
      },
      error: (error) => {
        console.error('Error loading coffees:', error);
        this.message = 'Failed to load coffees. Please try again.';
        this.coffee = [];
        this.loading = false;
      }
    });
  }


  nextPage() {
    if (this.nextPageUrl) {
      this.getTheListCoffePerProfile(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.prevPageUrl) {
      this.getTheListCoffePerProfile(this.currentPage - 1);
    }
  }

  get coffeeCount(): number {
    return this.coffee ? this.coffee.length : 0;
  }

  deleteCoffee(pk : number , ){
    return this.service.deleteCoffee(pk , this.currentPage).subscribe({
      next: () => {
        console.log('Coffee deleted successfully');

        this.getTheListCoffePerProfile(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting coffee:', err);
      }
    })
  }
}

