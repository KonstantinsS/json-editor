import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  if (!inject(UserService).user.value) {
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
