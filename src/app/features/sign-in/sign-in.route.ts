import { Routes } from '@angular/router';
import { signInGuard } from '@core/guards';

export const signInRoutes: Routes = [
  {
    path: '',
    title: 'Connexion',
    canActivate: [signInGuard],
    loadComponent: () => import('./pages/sign-in').then((c) => c.SignIn)
  }
];
