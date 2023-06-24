import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouteName } from '~shared/enums/route-name';

import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `/${RouteName.Dashboard}`,
    pathMatch: 'full',
  },
  {
    path: RouteName.Dashboard,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteName.Error,
    loadComponent: () => import('./error/error.component').then((c) => c.ErrorComponent),
  },
  {
    path: '',
    loadChildren: () => import('./collection/collection.module').then((m) => m.CollectionModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: `/${RouteName.Dashboard}` },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
