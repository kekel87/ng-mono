import { Routes } from '@angular/router';

import { RouteName } from '~shared/enums/route-name';

import * as authGuards from './auth/auth.guard';

export default [
  {
    path: '',
    redirectTo: `/${RouteName.Dashboard}`,
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: RouteName.Dashboard,
    loadChildren: () => import('./dashboard/dashboard.routes'),
    canActivate: [authGuards.canActivate],
  },
  {
    path: RouteName.Error,
    loadComponent: () => import('./error/error.component').then((c) => c.ErrorComponent),
  },
  {
    path: '',
    loadChildren: () => import('./collection/collection.routes'),
    canActivate: [authGuards.canActivate],
  },
  { path: '**', redirectTo: `/${RouteName.Dashboard}` },
] satisfies Routes;
