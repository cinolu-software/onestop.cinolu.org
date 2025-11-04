import { Routes } from '@angular/router';

export const eventsRoutes: Routes = [
  {
    path: 'events',
    children: [
      {
        path: '',
        title: 'Liste des événements',
        loadComponent: () => import('./pages/list-events/list-events').then((c) => c.ListEvents),
      },
      {
        path: 'add',
        title: 'Créer un événement',
        loadComponent: () => import('./pages/add-event/add-event').then((c) => c.AddEventComponent),
      },
      {
        path: 'edit/:slug',
        title: 'Modifier un événement',
        loadComponent: () => import('./pages/edit-event/edit-event').then((c) => c.EditEventComponent),
      },
    ],
  },
  {
    path: 'event-categories',
    title: "Catégories d'événements",
    loadComponent: () => import('./pages/event-categories/event-categories').then((c) => c.EventCategories),
  },
];
