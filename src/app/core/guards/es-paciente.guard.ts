import { CanActivateFn , Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
export const esPacienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auth = inject(Auth)
  if(authService.GetUserRol() === 'Paciente'){
    return true;
  }else{
    router.navigate(['Inicio']);
    return false;
  }
};
