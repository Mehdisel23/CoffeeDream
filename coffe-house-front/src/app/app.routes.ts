import { Routes } from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {HomeComponent} from './features/home/home.component';
import {RegisterComponent} from './features/auth/register/register.component';
import {VerifyTokenComponent} from './features/auth/verify-token/verify-token.component';
import {SellerprofileComponent} from './features/user/seller/sellerprofile/sellerprofile.component';
import {UnauthorizedComponent} from './features/page/unauthorized/unauthorized.component';
import {AddCoffeComponent} from './features/user/seller/add-coffe/add-coffe.component';
import {SellerBaseComponent} from './features/user/seller/seller-base/seller-base.component';
import {sellerGuard} from './core/guards/seller.guard';
import {ClientBaseComponent} from './features/user/client/client-base/client-base.component';
import {CoffeRestoComponent} from './features/user/client/coffe-resto/coffe-resto.component';
import {clientGuard} from './core/guards/client.guard';
import {BuyCoffeeComponent} from './features/user/client/buy-coffee/buy-coffee.component';
import {CoffeDetailComponent} from './features/page/coffe-detail/coffe-detail.component';

export const routes: Routes = [
  {
    path :"login",
    component : LoginComponent

  },

  {
    path : "",
    component : HomeComponent,

  },
  {
    path:"coffee/:id",
    component: CoffeDetailComponent
  },
  {
    path : "register",
    component : RegisterComponent
  },
  {
    path: 'verification/:token',
    component: VerifyTokenComponent
  },
  {
    path:'seller',
    component: SellerBaseComponent,
    canActivate : [sellerGuard],
    children :[
      {
        path : 'profile',
        component : SellerprofileComponent
      },
      {
        path : 'add-coffee',
        component : AddCoffeComponent
      }
    ]
  },
  {
    path : "client",
    component : ClientBaseComponent,

    children :[
      {
        path : "buy-coffe",
        component: BuyCoffeeComponent
      },
      {
        path: "resto",
        component: CoffeRestoComponent
      }
    ]

  },

  {
    path:'unau',
    component : UnauthorizedComponent
  }
  ];

