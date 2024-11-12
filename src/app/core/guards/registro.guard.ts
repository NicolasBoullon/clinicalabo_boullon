import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const registroGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth)
  if(!auth.currentUser){
    return true;
  }else{  
    router.navigate(['Inicio']);
    return false;
  }
};
