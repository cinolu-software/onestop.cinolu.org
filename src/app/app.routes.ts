import { Route } from '@angular/router';
import { authGuard } from '@core/guards';
import { Layout } from './layout/layout';

export const routes: Route[] = [
  {
    path: 'dashboard',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
  },

  {
    path: '',
    component: Layout,
    data: { layout: 'fixed-layout' },
    loadChildren: () => import('./features/landing/landing.routes').then((m) => m.landingRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'empty-layout' },
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: '**',
    component: Layout,
    data: { layout: 'fixed-layout' },
    loadChildren: () => import('./features/landing/landing.routes').then((m) => m.landingRoutes)
  }
];
