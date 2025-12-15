import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'programs/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'blog/articles/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'events/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'projects/edit/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'users/edit/:email',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
