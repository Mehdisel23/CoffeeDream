import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterLink , CommonModule , RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {


  constructor(private authService: AuthService ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  get isSeller():boolean{
    return this.authService.isSeller();
  }

  get isClient():boolean{
    return this.authService.isClient();
  }


}
