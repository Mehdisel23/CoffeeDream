import {Component, OnInit} from '@angular/core';
import {CoffeeService} from '../../core/services/coffee.service';
import {Coffee} from '../../core/model/coffee';
import {CommonModule} from '@angular/common';
import {SellerService} from '../../core/services/users/seller.service';
import {AuthService} from '../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

    coffee : Coffee[] = [];
    currentPage = 1;
    totalPages =0 ;
    totalCount = 0;
    nextPageUrl: string | null = null;
    prevPageUrl: string | null = null;
    isLoading = false;
    error: string | null = null;
    searchName : string = "";
    searchType : string = "";
    searchLocation : string ="";

    constructor(private service :CoffeeService , private sellerService : SellerService
    , private auth : AuthService , private router : Router) {
    }
    ngOnInit(): void {

        this.loadCoffees()

    }

    loadCoffees( page:number =1){

      this.isLoading = true;
      this.error = null;

      this.service.getCoffees(page).subscribe({ next :(data) =>
      {
        console.log("heyyyythis the last log " ,data.results)
        if (data && data.results && Array.isArray(data.results)) {
          this.coffee = data.results;
          this.currentPage = page;
          this.totalCount = data.count || 0;
          this.nextPageUrl = data.next;
          this.prevPageUrl = data.previous;
          this.totalPages = Math.ceil(this.totalCount / 10);
        } else {
          console.error('Unexpected data structure:', data);
          this.coffee = [];
          this.error = 'Invalid data received from server';
        }
        this.isLoading = false;
      },
        error: (error) => {
          console.error('Error loading coffees:', error);
          this.error = 'Failed to load coffees. Please try again.';
          this.coffee = [];
          this.isLoading = false;
        }
      });
    }
  nextPage() {
    if (this.nextPageUrl) {
      this.loadCoffees(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.prevPageUrl) {
      this.loadCoffees(this.currentPage - 1);
    }
  }
  get coffeeCount(): number {
    return this.coffee ? this.coffee.length : 0;
  }

  deleteCoffee(pk : number , ){
      return this.sellerService.deleteCoffee(pk , this.currentPage).subscribe({
        next: () => {
          console.log('Coffee deleted successfully');

          this.loadCoffees(this.currentPage);
        },
        error: (err) => {
          console.error('Error deleting coffee:', err);
        }
      })
  }
  get isSeller(){
      return this.auth.isSeller();
  }

  get isClient(){
      return this.auth.isClient();
  }

  searchCoffe(page : number = 1){
    this.service.searchCoffee(this.searchName , this.searchType , this.searchLocation , page).subscribe(
      response => {this.coffee = response.results}
    )
  }

  goToCoffeeDetail(id? : number ){
    if (id === undefined) {
      console.warn('Coffee ID is undefined');
      return;
    }
      console.log("cooooorrrect" ,id);
      this.router.navigate(['/coffee' , id])
  }
}
