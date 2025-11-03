import { Routes } from '@angular/router';

export const programsRoutes: Routes = [
  {
    path: 'programs',
    title: 'Les programmes',
    loadComponent: () => import('./pages/list-programs/list-programs').then((c) => c.ListPrograms),
  },
  {
    path: 'programs/add',
    title: 'Ajouter un programme',
    loadComponent: () => import('./pages/add-program/add-program').then((c) => c.AddProgramPage),
  },
  {
    path: 'programs/edit/:slug',
    title: 'Modifier un programme',
    loadComponent: () => import('./pages/update-program/update-program').then((c) => c.UpdateProgram),
  },
  {
    path: 'subprograms',
    title: 'Les sous-programmes',
    loadComponent: () => import('./pages/list-subprograms/list-subprograms').then((c) => c.ListSubprograms),
  },
  {
    path: 'program-categories',
    title: 'Les categories',
    loadComponent: () => import('./pages/program-categories/program-categories').then((c) => c.ProgramCategories),
  },
];
