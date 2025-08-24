import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import {NavComponent} from './shared/nav/nav.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent , CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'coffe-house-front';

  hideNavbar = false ;

  constructor(private router :Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd){
        const hidenRoutes = ['/login', '/register'];
        this.hideNavbar =hidenRoutes.includes(event.urlAfterRedirects);
      }
    })
  }
}
