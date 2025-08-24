import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {SellerProfile, User} from '../../model/user';
import {Coffee} from '../../model/coffee';

@Injectable({
  providedIn: 'root'
})

export class SellerService {

  private apiUrl = 'http://localhost:8000/api/users/profile/seller'

  constructor(private http: HttpClient) {
  }

  sellerProfile(): Observable<SellerProfile> {
    return this.http.get<SellerProfile>(this.apiUrl).pipe(
      tap((response)=> {
        console.log("this is the responce from the back maaan ");
        console.log(response)
      })
    );
  }

  //this will not work car we are working with file
  // and we hearder like content-type:multipart/parse
  // and we can t set boundry manually
  addCoffe(data: Coffee): Observable<any> {
    return this.http.post("http://localhost:8000/api/coffee/addcoffe/", data);
  }
  //let angular do all the work using formData
  addCoffeWithFormData(formData: FormData):Observable<any>{
    return this.http.post("http://localhost:8000/api/coffee/addcoffe/", formData).pipe(
      tap( ()=>{
        this.clearCache(); }
  )
    );
  }


  deleteCoffee(pk : number , page: number = 1){
    return this.http.delete(`http://localhost:8000/api/coffee/delete-coffe/${pk}/`).pipe(
      tap(() =>{
        this.clearCache();
      }),
      catchError(error => {
        console.error('Delete failed', error);
        alert(`Delete failed: ${error.status} ${error.statusText}\n${error.error?.detail || JSON.stringify(error.error)}`);
        return throwError(() => error);
      })
    );
  }

  updateCoffee(pk : number , data: Coffee):Observable<any>{
    return this.http.put(`http://localhost:8000/api/coffee/update-coffee/${pk}` , data).pipe(
      tap(()=>
        console.log("image choosed succussfuly") ),
      catchError(error => {
        console.error('Error uploading image:', error);
        return throwError(() => error);
      })
    );

  }



  private clearCache(){
    try{
      const keys = Object.keys(localStorage);

      const cacheKeys = keys.filter(key => key.startsWith('coffeList_page_'));

      cacheKeys.forEach(key =>{
        localStorage.removeItem(key)
        console.log(`🗑️ Cleared cache: ${key}`);
      });
      console.log(`✅ Cleared ${cacheKeys.length} cache entries after delete`);
    }catch (error) {
      console.error('Error clearing cache:', error);
    }
  }


  chooseImageProfile(file: File):Observable<any>{

    const formData = new FormData();
    formData.append('image', file);
    return this.http.patch("http://localhost:8000/api/users/profile/seller/addImage/" , formData).pipe(
    tap(()=>
    console.log("image choosed succussfuly") ),
    catchError(error => {
      console.error('Error uploading image:', error);
      return throwError(() => error);
    })
  )
  }

  updateSellerProfile(data : SellerProfile){
    return this.http.put('http://localhost:8000/api/users/profile/seller/update/' , data).pipe(
      tap((responce) =>{
        console.log(responce);
      })
    );
  }

}
