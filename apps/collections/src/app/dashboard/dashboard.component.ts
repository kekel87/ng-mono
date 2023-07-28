import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { UpdateService } from '~app/core/update.service';
import { metas } from '~shared/consts/metas';
import { OrderUtils } from '~shared/utils/order';

import * as counterSelectors from './store/counter/counter.selectors';

@Component({
  selector: 'col-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  loading$ = this.store.select(counterSelectors.selectIsLoading);
  counters$ = this.store.select(counterSelectors.selectEntities);

  readonly metas = metas;
  readonly originalOrder = OrderUtils.original;

  constructor(
    private store: Store,
    public update: UpdateService
  ) {}
}
