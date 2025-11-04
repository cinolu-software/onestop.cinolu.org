import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: 'projects',
    title: 'Les projets',
    children: [
      {
        path: '',
        title: 'Liste des projets',
        loadComponent: () => import('./pages/list-projects/list-projects').then((c) => c.ListProjects),
      },
      {
        path: 'add',
        title: 'Créer un projet',
        loadComponent: () => import('./pages/add-project/add-project').then((c) => c.AddProjectComponent),
      },
      {
        path: 'edit/:slug',
        title: 'Modifier un projet',
        loadComponent: () => import('./pages/edit-project/edit-project').then((c) => c.EditProjectComponent),
      },
    ],
  },
  {
    path: 'project-categories',
    title: 'Les catégories de projets',
    loadComponent: () => import('./pages/project-categories/project-categories').then((m) => m.ProjectCategories),
  },
];
