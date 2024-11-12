import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

export const estaLogGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auth = inject(Auth)
  if(auth.currentUser){
    return true;
  }else{
    return false;
  }
};
