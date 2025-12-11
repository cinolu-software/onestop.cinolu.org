import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('./pages/dashboard').then((c) => c.Dashboard)
  }
];
