import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: '',
        title: 'Liste des utilisateurs',
        loadComponent: () => import('./pages/list-users/list-users').then((c) => c.ListUsers),
      },
      {
        path: 'edit/:email',
        title: "Modifier l'utilisateur",
        loadComponent: () => import('./pages/edit-user/edit-user').then((c) => c.EditUser),
      },
      {
        path: 'add',
        title: 'Ajouter un utilisateur',
        loadComponent: () => import('./pages/add-user/add-user').then((c) => c.AddUserComponent),
      },
    ],
  },
  {
    path: 'roles',
    title: 'Roles',
    loadComponent: () => import('./pages/user-roles/user-roles').then((c) => c.UserRoles),
  },
];
