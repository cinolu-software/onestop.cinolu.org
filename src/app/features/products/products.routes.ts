import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Mes produits',
        loadComponent: () => import('./pages/list-products/list-products').then((c) => c.ListVentures),
      },
      {
        path: 'add',
        title: 'Ajouter un produit',
        loadComponent: () => import('./pages/add-product/add-product').then((c) => c.AddProduct),
      },
      {
        path: 'update/:slug',
        title: 'Modifier un produit',
        loadComponent: () => import('./pages/edit-product/edit-product').then((c) => c.EditProductComponent),
      },
    ],
  },
];
