import { AsyncPipe, DatePipe, KeyValuePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

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
    AsyncPipe,
    KeyValuePipe,
    DatePipe,
    NgForOf,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  readonly MEASURE_TYPE_ICONS = MEASURE_TYPE_ICONS;
  readonly IntervalType = IntervalType;

  interval$ = this.store.select(filterFeature.selectInterval);
  asNext$ = this.interval$.pipe(map((interval) => asNext(interval)));
  rooms$ = this.store.select(selectRooms);
  modules$ = this.store.select(selectModulesEntities);
  enabledModulesType$ = this.store.select(filterFeature.selectEntities);

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

  unsorted() {
    return 0;
  }
}
