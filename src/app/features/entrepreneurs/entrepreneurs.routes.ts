import { Routes } from '@angular/router';

export const entrepreneursRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Liste des entrepreneurs',
        loadComponent: () => import('./pages/list-entrepreneurs/list-entrepreneurs').then((c) => c.ListEntrepreneurs),
      },
      {
        path: 'ventures/edit/:slug',
        title: "Modifier l'entreprise",
        loadComponent: () => import('./pages/edit-venture/edit-venture').then((c) => c.EditVentureComponent),
      },
      {
        path: 'ventures',
        title: 'Liste des entreprises',
        loadComponent: () => import('./pages/list-ventures/list-ventures').then((c) => c.ListVentures),
      },
    ],
  },
];
