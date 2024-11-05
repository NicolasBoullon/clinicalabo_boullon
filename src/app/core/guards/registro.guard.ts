import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const registroGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if(!authService.GetUserEmail()){
    return true;
  }else{
    return false;
  }
};
