import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';

import { MeasureType } from '../shared/api/enums/measure-type';
import { MEASURE_TYPE_ICONS } from '../shared/constants/measure-type-icon';
import { IntervalType } from '../shared/enums/interval-type';
import { filterActions } from '../shared/stores/filter/filter.actions';
import { filterFeature } from '../shared/stores/filter/filter.reducer';
import { selectModulesEntities, selectRooms } from '../shared/stores/selectors';
import { asNext } from '../shared/utils/date-interval';

@Component({
  selector: 'net-filter',
  standalone: true,
  imports: [
    KeyValuePipe,
    DatePipe,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  readonly MEASURE_TYPE_ICONS = MEASURE_TYPE_ICONS;
  readonly IntervalType = IntervalType;

  autoRefresh = toSignal(this.store.select(filterFeature.selectAutoRefresh));
  interval = toSignal(this.store.select(filterFeature.selectInterval));
  asNext = computed(() => {
    const interval = this.interval();
    return interval ? asNext(interval) : undefined;
  });
  rooms = toSignal(this.store.select(selectRooms));
  modules = toSignal(this.store.select(selectModulesEntities));
  enabledModulesType = toSignal(this.store.select(filterFeature.selectEntities));

  constructor(private store: Store) {}

  toggleEnabled(id: string, type: MeasureType, enabled: boolean): void {
    this.store.dispatch(
      enabled
        ? filterActions.enableModuleMeasure({ moduleMeasureType: { id, type } })
        : filterActions.disableModuleMeasure({ moduleMeasureType: { id, type } })
    );
  }

  changeIntervalType(intervalType: IntervalType): void {
    this.store.dispatch(filterActions.changeIntervalType({ intervalType }));
  }

  next(): void {
    this.store.dispatch(filterActions.nextInterval());
  }

  previous(): void {
    this.store.dispatch(filterActions.previousInterval());
  }

  refresh(): void {
    this.store.dispatch(filterActions.refresh());
  }

  changeAutoRefresh(autoRefresh: boolean): void {
    this.store.dispatch(filterActions.changeAutoRefresh({ autoRefresh }));
  }

  unsorted() {
    return 0;
  }
}
