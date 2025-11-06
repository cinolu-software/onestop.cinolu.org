import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard/blog/articles/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/programs/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/ventures/update/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/entrepreneurs/ventures',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/entrepreneurs/ventures/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/users/edit/:email',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/projects/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/events/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/ventures/view/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/products/update/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
