import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { RequestState } from '@ng-mono/shared/utils';

import { measureActions } from './measure.actions';
import { MeasureSource } from '../../models/measure-source';

export interface State extends EntityState<MeasureSource> {
  requestState: RequestState;
}

const adapter: EntityAdapter<MeasureSource> = createEntityAdapter<MeasureSource>({
  selectId: ({ id, timestamp }: MeasureSource) => `${id}-${timestamp}`,
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
    on(measureActions.fetchError, (state): State => ({ ...state, requestState: RequestState.Error }))
  ),
  extraSelectors: ({ selectMeasureState }) => ({
    ...adapter.getSelectors(selectMeasureState),
  }),
});
