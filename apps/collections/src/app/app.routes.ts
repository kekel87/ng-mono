import { Routes } from '@angular/router';

import { RouteName } from '~shared/enums/route-name';

import { AuthGuard } from './auth/auth.guard';

export default [
  {
    path: '',
    redirectTo: `/${RouteName.Dashboard}`,
    pathMatch: 'full',
  },
  {
    path: RouteName.Dashboard,
    loadChildren: () => import('./dashboard/dashboard.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: RouteName.Error,
    loadComponent: () => import('./error/error.component').then((c) => c.ErrorComponent),
  },
  {
    path: '',
    loadChildren: () => import('./collection/collection.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes'),
  },
  { path: '**', redirectTo: `/${RouteName.Dashboard}` },
] satisfies Routes;
