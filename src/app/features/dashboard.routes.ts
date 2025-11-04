import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('@features/common/dashboard/pages/dashboard').then((c) => c.Dashboard)
  },
  {
    path: 'community',
    loadChildren: () => import('@features/user/outreach/outreach.routes').then((c) => c.outreachRoutes)
  },
  {
    path: 'account',
    loadChildren: () => import('@features/common/account/account.routes').then((c) => c.accountRoutes)
  },
  {
    path: 'ventures',
    loadChildren: () => import('@features/user/ventures/ventures.routes').then((c) => c.venturesRoutes)
  },
  {
    path: 'products',
    loadChildren: () => import('@features/user/products/products.routes').then((c) => c.productsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/admin/users/users.routes').then((c) => c.usersRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/admin/programs/programs.routes').then((c) => c.programsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/admin/projects/projects.routes').then((c) => c.projectsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('@features/admin/events/events.routes').then((c) => c.eventsRoutes)
  },
  {
    path: 'blog',
    loadChildren: () => import('@features/admin/blog/blog.routes').then((c) => c.blogRoutes)
  },
  {
    path: 'entrepreneurs',
    loadChildren: () => import('@features/admin/entrepreneurs/entrepreneurs.routes').then((c) => c.entrepreneursRoutes)
  }
];
