import { Route } from '@angular/router';

import { authRoutes, isAuthCanActivate } from '@ng-mono/auth';

import { LogFormComponent } from './log/components/log-form/log-form.component';
import { LogListComponent } from './log/components/log-list/log-list.component';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [isAuthCanActivate],
    component: LogListComponent,
  },
  {
    path: 'new',
    canActivate: [isAuthCanActivate],
    component: LogFormComponent,
  },
  {
    path: '',
    children: authRoutes,
  },
];
