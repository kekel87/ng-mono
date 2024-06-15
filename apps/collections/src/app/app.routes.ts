import { Routes } from '@angular/router';

import { isAuthCanActivate, authRoutes } from '@ng-mono/auth';
import { RouteName } from '~shared/enums/route-name';

export default [
  {
    path: '',
    redirectTo: `/${RouteName.Dashboard}`,
    pathMatch: 'full',
  },
  {
    path: '',
    children: authRoutes,
  },
  {
    path: RouteName.Dashboard,
    loadChildren: () => import('./dashboard/dashboard.routes'),
    canActivate: [isAuthCanActivate],
  },
  {
    path: RouteName.Error,
    loadComponent: () => import('./error/error.component').then((c) => c.ErrorComponent),
  },
  {
    path: '',
    loadChildren: () => import('./collection/collection.routes'),
    canActivate: [isAuthCanActivate],
  },
  { path: '**', redirectTo: `/${RouteName.Dashboard}` },
] satisfies Routes;
