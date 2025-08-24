import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const access_token = localStorage.getItem('access_token');

  if (access_token){
    const newReq = req.clone({
      setHeaders:{
        Authorization :`Bearer ${access_token}`
      }
    })
    return next(newReq);
  }
  return next(req);
};
