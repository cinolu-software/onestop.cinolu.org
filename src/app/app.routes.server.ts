import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/articles/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'programs/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'ventures/update/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'users/edit/:email',
    renderMode: RenderMode.Client
  },
  {
    path: 'projects/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'events/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'ventures/view/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'products/update/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
