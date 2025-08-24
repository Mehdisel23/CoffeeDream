import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {LoginData, RegisterData} from '../model/auth';
import {Router} from '@angular/router';


export interface LoginResponse {
  access: string;
  refresh: string;
  role :string;
  user?: any;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authApi = "http://localhost:8000/api/users";
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http : HttpClient , private router : Router) { }

  registerUser(data: RegisterData):Observable<any>{
    return  this.http.post(`${this.authApi}/auth/register/`, data);
  }
  registerSeller(data: RegisterData):Observable<any>{
    return  this.http.post(`${this.authApi}/auth/register/seller`, data);
  }
  loginUser(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApi}/auth/login/`, data)
      .pipe(
        tap(response => {
          // Store tokens in localStorage
          if (response.access) {
            localStorage.setItem('access_token', response.access);
          }
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
          if(response.role){
            localStorage.setItem('role', response.role)
          }
        })
      );
  }


  verifyToken(token: string): Observable<any> {
    return this.http.post(`${this.authApi}/auth/verify-token/${token}/`,token);
  }
  private storeTokens(accessToken: string, refreshToken: string , role :string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('role' , role )
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
        // Clear local storage and navigate regardless of the request outcome
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        this.router.navigate(['/login']);
  }

  isSeller():boolean{
    const role = localStorage.getItem('role');
    return role == 'seller';
  }

  isClient():boolean {
    const role = localStorage.getItem('role');
    return role == "client";
  }
}
