import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {Coffee} from '../model/coffee';


interface CoffeeResponse {
  results: Coffee[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface CacheItem {
  data: CoffeeResponse;
  timestamp: number;
  expiresIn: number;
}
@Injectable({
  providedIn: 'root'
})
export class CoffeeService {
  //using this when working with cache in memroy
  //but is not persistant
  //hen the user reload the page is reset to null
  //private caffeeCache : Coffee[] | null = null ;
  private apiUrl = "http://localhost:8000/api/coffee";
  private cacheExpiryTime = 5 * 60 * 1000;

  constructor(private http: HttpClient) { }

   /*getCoffees(page : number =1):Observable<CoffeeResponse>{
    const cacheKey = `coffeList_page_${page}`;

    const cached = localStorage.getItem("coffeeList");
    if (cached){
      return of(JSON.parse(cached))
    }
    return this.http.get<Coffee[]>(`${this.apiUrl}/allcoffes/?page=${page}`).pipe(
      tap(caffee => localStorage.setItem('coffeeList' ,JSON.stringify(caffee))),
    );

   }*/


    getCoffees(page : number =1):Observable<CoffeeResponse>{
      const cachekey = `coffeList_page_${page}`;
      const cached = this.getCachedData(cachekey);

      if (cached) {
        console.log(`✅ Cache HIT for page ${page}`);
        return of(cached);
      }
      console.log(`❌ Cache MISS for page ${page} - fetching from API`);
      return this.http.get<CoffeeResponse>(`${this.apiUrl}/allcoffes/?page=${page}`).pipe(
        tap(response  => {
          this.setCached(cachekey , response);
          console.log(`💾 Page ${page} cached successfully`);
        })
      );
    }

    private getCachedData(key : string):CoffeeResponse | any {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        const cacheItem: CacheItem = JSON.parse(cached);
        const now = Date.now();

        if (now > cacheItem.timestamp + cacheItem.expiresIn){
          console.log("expires cache");
          localStorage.removeItem(key);
        }
        return cacheItem.data;
      }catch (error){
        console.error('Error reading from cache:', error);
        localStorage.removeItem(key);
        return null;
      }
    }

    private setCached(key : string , data : CoffeeResponse):void{
      try{
        const cacheItem : CacheItem ={
          data : data ,
          timestamp : Date.now(),
          expiresIn : this.cacheExpiryTime
        }
        localStorage.setItem(key, JSON.stringify(cacheItem));
      }
      catch (error) {
        console.error('Error saving to cache:', error);
      }
    }

    getAddedCoffeePerUser(page :number = 1): Observable<CoffeeResponse>{
      const cachedKey = `coffee_per_user${page}`;
      const cachedData = this.getCachedData(cachedKey)

      if(cachedData){
        console.log(`✅ Cache HIT for page ${page}`);
        return of(cachedData);
      }
      return this.http.get<CoffeeResponse>(`${this.apiUrl}/profile/coffee-peruser/?page=${page}`).pipe(
        tap(response =>{
          this.setCached(cachedKey , response);
          console.log(`💾 Page ${page} cached successfully`);
        })
      )

    }

    searchCoffee(name:string , type: string , address: string ,page : number =1):Observable<CoffeeResponse>{
      const params = {
        name,
        type,
        address,
        page: page.toString(),
      };
      return  this.http.get<CoffeeResponse>(`${this.apiUrl}/coffee/search/`, {params});
    }

    getCoffeDetailById(id : number):Observable<{ data: Coffee; message: string }>{
      return this.http.get<{ data: Coffee; message: string }>(`${this.apiUrl}/coffee/${id}/`).pipe(
        tap(response => console.log(response))
      )
    }
}
