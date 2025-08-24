import {Component, OnInit} from '@angular/core';
import {SellerProfile} from '../../../../core/model/user';
import {CommonModule} from '@angular/common';
import {ClientService} from '../../../../core/services/users/client.service';
import {Observable} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-coffe-resto',
  imports: [CommonModule, FormsModule],
  templateUrl: './coffe-resto.component.html',
  styleUrl: './coffe-resto.component.scss'
})
export class CoffeRestoComponent  implements  OnInit{

  restaurants: SellerProfile[] = [];
  isLoading =  true;
  error : string | null = null ;
  currentPage = 1;
  totalPages =0 ;
  totalCount = 0;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;
  search : string = '';

  constructor(private service : ClientService) {
  }

  ngOnInit( ) {
    this.loadRestaurents();
  }


  private loadRestaurents(page : number =1) {
    this.isLoading = true ;
    this.error = null ;

    this.service.getAllRestaurants(page).subscribe({
      next : (data) =>{
        if (data && data.results && Array.isArray(data.results)){
          this.restaurants = data.results ;
          this.currentPage = page ;
          this.totalCount = data.count || 0 ;
          this.nextPageUrl = data.next;
          this.prevPageUrl = data.previous;
          this.totalPages = Math.ceil(this.totalCount / 10);
        }else {
          console.error('Unexpected data structure:', data);
          this.restaurants = [];
          this.error = 'Invalid data received from server';
        }
        this.isLoading = false;
        console.log(data.results);
      },
      error: (error) => {
        console.error('Error loading coffees:', error);
        this.error = 'Failed to load coffees. Please try again.';
        this.restaurants = [];
        this.isLoading = false;
      }
    });
  }


  searchRestaurent(page : number=1){
    this.service.searchRestaurent(this.search , page).subscribe(
      response => {this.restaurants = response.results}
    )
  }
}
