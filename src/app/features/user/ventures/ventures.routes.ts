import { Routes } from '@angular/router';

export const venturesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Mes entreprises',
        loadComponent: () => import('./pages/list-ventures/list-ventures').then((c) => c.ListVentures),
      },
      {
        path: 'add',
        title: 'Ajouter',
        loadComponent: () => import('./pages/add-venture/add-venture').then((c) => c.AddVenture),
      },
      {
        path: 'update/:slug',
        title: 'Modifier',
        loadComponent: () => import('./pages/edit-venture/edit-venture').then((c) => c.EditVentureComponent),
      },
      {
        path: 'view/:slug',
        title: 'Voir',
        loadComponent: () => import('./pages/detail-venture/detail-venture').then((c) => c.DetailVenture),
      },
    ],
  },
];
