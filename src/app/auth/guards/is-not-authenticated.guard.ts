import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  const authServie = inject(AuthService);
  const router = inject(Router);  
  
  if (authServie.authStatus() !== AuthStatus.authenticated) {
    return true;
  }
  
  router.navigate(['/home']);
  return false;
  
  
};
