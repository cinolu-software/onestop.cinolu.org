import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../auth/auth.store';

export const signInGuard: CanActivateFn = (): boolean | UrlTree | Promise<boolean | UrlTree> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const user = authStore.user();
  const roles = user?.roles as unknown as string[];
  const hasRights = roles?.includes('admin') || roles?.includes('staff');
  if (hasRights) return router.createUrlTree(['/']);
  return true;
};
