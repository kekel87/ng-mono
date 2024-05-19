import { Route } from '@angular/router';

import { LogFormComponent } from './log/components/log-form/log-form.component';
import { LogListComponent } from './log/components/log-list/log-list.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LogListComponent,
  },
  {
    path: 'new',
    component: LogFormComponent,
  },
];
