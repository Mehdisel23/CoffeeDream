import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const sellerGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService) ;
  const router = inject(Router);

  if (service.isSeller()){
    return true ;
  }
  else{
    return  router.createUrlTree(['/unau']);
  }
};
