import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { UpdateService } from '~app/core/update.service';

import { DashboardComponent } from './dashboard.component';
import { CounterEffects } from './store/counter/counter.effects';
import { counterFeature } from './store/counter/counter.feature';

export default [
  {
    path: '',
    providers: [UpdateService, provideState(counterFeature), provideEffects([CounterEffects])],
    component: DashboardComponent,
  },
] satisfies Routes;
