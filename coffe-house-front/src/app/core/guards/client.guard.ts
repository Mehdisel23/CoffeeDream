import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const clientGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  if (service.isClient()){
    return true;
  }
  else{
    return router.createUrlTree(['/unau']);
  }
};
