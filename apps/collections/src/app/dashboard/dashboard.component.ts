import { AsyncPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { original } from '@ng-mono/shared';
import { LoaderComponent } from '~shared/components/loader/loader.component';
import { metas } from '~shared/consts/metas';

import { counterFeature } from './store/counter/counter.feature';

@Component({
  selector: 'col-dashboard',
  standalone: true,
  imports: [AsyncPipe, KeyValuePipe, NgIf, NgForOf, RouterLink, MatCardModule, MatIconModule, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  loading$ = this.store.select(counterFeature.selectIsLoading);
  counters$ = this.store.select(counterFeature.selectEntities);

  readonly metas = metas;
  readonly originalOrder = original;

  constructor(private store: Store) {}
}
