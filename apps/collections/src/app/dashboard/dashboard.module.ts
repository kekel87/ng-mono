import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UpdateService } from '~app/core/update.service';
import { LoaderComponent } from '~shared/components/loader/loader.component';

import { DashboardComponent } from './dashboard.component';
import * as dashboardReducer from './dashboard.reducer';
import { DashboardRoutingModule } from './dashboard.routing';
import { CounterEffects } from './store/counter/counter.effects';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature(dashboardReducer.featureKey, dashboardReducer.reducers),
    EffectsModule.forFeature([CounterEffects]),
    MatIconModule,
    MatCardModule,
    LoaderComponent,
    DashboardRoutingModule,
  ],
  providers: [UpdateService],
  exports: [DashboardComponent],
})
export class DashboardModule {}
