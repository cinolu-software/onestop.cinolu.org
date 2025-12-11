import { Routes } from '@angular/router';

export const signInRoutes: Routes = [
  {
    path: '',
    title: 'Connexion',
    loadComponent: () => import('./pages/sign-in').then((c) => c.SignIn)
  }
];
