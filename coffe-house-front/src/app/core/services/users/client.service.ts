import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {SellerProfile} from '../../model/user';


interface RestaurantResponse {
  results : SellerProfile[] ;
  count : number ;
  next : string | null ;
  previous : string | null ;
}

interface CacheItem {
  data: RestaurantResponse;
  timestamp: number;
  expiresIn: number;
}
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8000/api/users';
  private cacheExpiryTime = 5 * 60 * 1000;

  constructor(private http : HttpClient) { }


  getAllRestaurants(page : number =1 ):Observable<RestaurantResponse>{
    const cachedKey = `restaurent_list_${page}`;
    const cachedData = this.getCachedData(cachedKey);

    if(cachedData) {
      console.log(`✅ Cache HIT for page ${page}`);
      return of(cachedData);
    }
    console.log(`❌ Cache MISS for page ${page} - fetching from API`);
    return this.http.get<RestaurantResponse>(`${this.apiUrl}/allrestaurents/?page=${page}`).pipe(
      tap(response => {
        this.setCached( cachedKey, response);
        console.log(`💾 Page ${page} cached successfully`);
      })
    );
  }


  private getCachedData(cachedKey: string) {
    try{
      const cachedData = localStorage.getItem(cachedKey);
      if(!cachedData) {return null}

      const cacheItem :CacheItem = JSON.parse(cachedData);
      const now = Date.now();

      if(now > cacheItem.timestamp + cacheItem.expiresIn){
        console.log("expires cache");
        localStorage.removeItem(cachedKey);
      }
      return cacheItem.data ;
    }catch (error){
      console.error('Error reading from cache:', error);
      localStorage.removeItem(cachedKey);
      return null;

  }
}


  private setCached(cachedKey: string, response: RestaurantResponse) {
    try {
      const cachedItem : CacheItem  ={
        data : response,
        timestamp : Date.now(),
        expiresIn : this.cacheExpiryTime
      }
      localStorage.setItem(cachedKey , JSON.stringify(cachedItem));
    }catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  searchRestaurent(address : string  , page : number =1):Observable<RestaurantResponse>{
    const params ={
      address , page : page.toString()
    }

    return this.http.get<RestaurantResponse>(`${this.apiUrl}/search/restaurent/`, {params}).pipe(
      tap(response =>
      console.log(response)
      )
    );
  }


}

