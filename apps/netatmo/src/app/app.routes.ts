import { Route } from '@angular/router';

import { IsLoggedGuard } from './auth/guards/is-logged.guard';
import { RedirectGuard } from './auth/guards/redirect.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./graph/graph.component').then((mod) => mod.GraphComponent),
    canActivate: [IsLoggedGuard],
  },
  {
    path: 'redirect',
    loadComponent: () => import('./graph/graph.component').then((mod) => mod.GraphComponent),
    canActivate: [RedirectGuard],
  },
];
