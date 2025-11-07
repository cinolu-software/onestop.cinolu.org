import { Route } from '@angular/router';
import { authGuard } from '@core/guards';
import { Layout } from './layout/layout';

export const routes: Route[] = [
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'Dashboard',
        loadComponent: () => import('@features/common/dashboard/pages/dashboard').then((c) => c.Dashboard)
      }
    ]
  },
  {
    path: 'community',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/user/outreach/outreach.routes').then((c) => c.outreachRoutes)
  },
  {
    path: 'account',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/common/account/account.routes').then((c) => c.accountRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/user/ventures/ventures.routes').then((c) => c.venturesRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/user/products/products.routes').then((c) => c.productsRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/users/users.routes').then((c) => c.usersRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/programs/programs.routes').then((c) => c.programsRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/projects/projects.routes').then((c) => c.projectsRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/events/events.routes').then((c) => c.eventsRoutes)
  },
  {
    path: 'blog',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/blog/blog.routes').then((c) => c.blogRoutes)
  },
  {
    path: '',
    component: Layout,
    data: { layout: 'dashboard-layout' },
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/entrepreneurs/entrepreneurs.routes').then((c) => c.entrepreneursRoutes)
  },
  {
    path: 'unauthorized',
    title: 'Accès non autorisé',
    loadComponent: () => import('@features/common/unauthorized/unauthorized').then((c) => c.UnauthorizedPage)
  },
  {
    path: '**',
    title: 'Page introuvable',
    loadComponent: () => import('@features/common/not-found/not-found').then((c) => c.NotFoundPage)
  }
];
