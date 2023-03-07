import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';

import { MeasureType } from '../shared/api/enums/measure-type';
import { MEASURE_TYPE_ICONS } from '../shared/constants/measure-type-icon';
import { filterActions } from '../shared/stores/filter/filter.actions';
import { filterFeature } from '../shared/stores/filter/filter.reducer';
import { selectModulesEntities, selectRooms } from '../shared/stores/selectors';

@Component({
  selector: 'net-filter',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, MatExpansionModule, MatIconModule, MatListModule, MatButtonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  readonly MEASURE_TYPE_ICONS = MEASURE_TYPE_ICONS;

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
}
