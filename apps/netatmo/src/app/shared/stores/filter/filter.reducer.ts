import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { filterActions } from './filter.actions';
import { IntervalType } from '../../enums/interval-type';
import { Interval } from '../../models/interval';
import { ModuleMesureType } from '../../models/module-measure-type';
import { build, next, previous } from '../../utils/date-interval';

const selectId = (m: ModuleMesureType): string => `${m.id}${m.type}`;
const adapter: EntityAdapter<ModuleMesureType> = createEntityAdapter<ModuleMesureType>({ selectId });

export interface State {
  autoRefresh: boolean;
  interval: Interval;
  enabledModuleMeasureType: EntityState<ModuleMesureType>;
}

const initialState: State = {
  autoRefresh: true,
  interval: build(IntervalType.Day),
  enabledModuleMeasureType: adapter.getInitialState(),
};

export const filterFeature = createFeature({
  name: 'filter',
  reducer: createReducer(
    initialState,
    on(filterActions.changeAutoRefresh, (state, { autoRefresh }): State => ({ ...state, autoRefresh })),
    on(
      filterActions.changeIntervalType,
      (state, { intervalType }): State => ({
        ...state,
        interval: build(intervalType),
      })
    ),
    on(filterActions.nextInterval, (state): State => ({ ...state, interval: next(state.interval) })),
    on(filterActions.previousInterval, (state): State => ({ ...state, interval: previous(state.interval) })),
    on(
      filterActions.enableModuleMeasure,
      (state, { moduleMeasureType }): State => ({
        ...state,
        enabledModuleMeasureType: adapter.upsertOne(moduleMeasureType, state.enabledModuleMeasureType),
      })
    ),
    on(
      filterActions.disableModuleMeasure,
      (state, { moduleMeasureType }): State => ({
        ...state,
        enabledModuleMeasureType: adapter.removeOne(selectId(moduleMeasureType), state.enabledModuleMeasureType),
      })
    ),
    on(
      filterActions.enableManyModuleMeasure,
      (state, { moduleMeasureTypes }): State => ({
        ...state,
        enabledModuleMeasureType: adapter.setAll(moduleMeasureTypes, state.enabledModuleMeasureType),
      })
    )
  ),
  extraSelectors: ({ selectEnabledModuleMeasureType }) => ({
    ...adapter.getSelectors(selectEnabledModuleMeasureType),
  }),
});
