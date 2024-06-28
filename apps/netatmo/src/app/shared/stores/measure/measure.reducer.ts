import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { RequestState } from '@ng-mono/shared/utils';

import { measureActions } from './measure.actions';
import { MeasureEntry } from '../../models/measure-entry';

export interface State extends EntityState<MeasureEntry> {
  requestState: RequestState;
}

const adapter: EntityAdapter<MeasureEntry> = createEntityAdapter<MeasureEntry>({
  selectId: ({ id, timestamp }: MeasureEntry) => `${id}-${timestamp}`,
});

const initialState: State = adapter.getInitialState({
  requestState: RequestState.Initial,
});

export const measureFeature = createFeature({
  name: 'measure',
  reducer: createReducer(
    initialState,
    on(measureActions.fetch, (state): State => ({ ...state, requestState: RequestState.Loading })),
    on(measureActions.fetchMany, (state): State => adapter.removeAll({ ...state, requestState: RequestState.Loading })),
    on(
      measureActions.fetchSuccess,
      (state, { measures }): State => adapter.upsertMany(measures, { ...state, requestState: RequestState.Success })
    ),
    on(measureActions.upsertMany, (state, { measures }): State => adapter.upsertMany(measures, state)),
    on(measureActions.fetchError, (state): State => ({ ...state, requestState: RequestState.Error }))
  ),
  extraSelectors: ({ selectMeasureState }) => ({
    ...adapter.getSelectors(selectMeasureState),
  }),
});
