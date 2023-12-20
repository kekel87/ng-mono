import { Routes } from '@angular/router';

import { UpdateService } from '~app/core/update.service';

import { counterResolver } from './counter.resolver';
import { DashboardComponent } from './dashboard.component';

export default [
  {
    path: '',
    providers: [UpdateService],
    component: DashboardComponent,
    resolve: { counter: counterResolver },
  },
] satisfies Routes;
