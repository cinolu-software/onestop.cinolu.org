import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: 'projects',
    title: 'Les projets',
    children: [
      {
        path: '',
        title: 'Liste des projets',
        loadComponent: () => import('./pages/list-projects/list-projects').then((c) => c.ListProjects)
      },
      {
        path: 'add',
        title: 'Créer un projet',
        loadComponent: () => import('./pages/add-project/add-project').then((c) => c.AddProjectComponent)
      },
      {
        path: 'update/:slug',
        title: 'Modifier un projet',
        loadComponent: () => import('./pages/update-project/update-project').then((c) => c.UpdateProject)
      }
    ]
  },
  {
    path: 'project-categories',
    title: 'Les catégories de projets',
    loadComponent: () => import('./pages/project-categories/project-categories').then((m) => m.ProjectCategories)
  }
];
