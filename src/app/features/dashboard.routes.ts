import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('@features/dashboard/pages/dashboard').then((c) => c.Dashboard)
  },
  {
    path: 'community',
    loadChildren: () => import('@features/outreach/outreach.routes').then((c) => c.outreachRoutes)
  },
  {
    path: 'account',
    loadChildren: () => import('@features/account/account.routes').then((c) => c.accountRoutes)
  },
  {
    path: 'ventures',
    loadChildren: () => import('@features/ventures/ventures.routes').then((c) => c.venturesRoutes)
  },
  {
    path: 'products',
    loadChildren: () => import('@features/products/products.routes').then((c) => c.productsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/users/users.routes').then((c) => c.usersRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/programs/programs.routes').then((c) => c.programsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/projects/projects.routes').then((c) => c.projectsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/events/events.routes').then((c) => c.eventsRoutes)
  },
  {
    path: 'blog',
    loadChildren: () => import('@features/blog/blog.routes').then((c) => c.blogRoutes)
  },
  {
    path: 'entrepreneurs',
    loadChildren: () => import('@features/entrepreneurs/entrepreneurs.routes').then((c) => c.entrepreneursRoutes)
  }
];
