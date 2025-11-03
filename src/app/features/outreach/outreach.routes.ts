import { Routes } from '@angular/router';

export const outreachRoutes: Routes = [
  {
    path: 'outreach',
    children: [
      {
        path: '',
        title: 'Vulgarisation - Outreach',
        loadComponent: () => import('./pages/outreach').then((c) => c.Outreach),
      },
    ],
  },
];
