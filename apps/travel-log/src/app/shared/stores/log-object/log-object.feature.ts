import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import bbox from '@turf/bbox';

import { RequestState } from '@ng-mono/shared';

import { logObjectActions } from './log-object.actions';
import { LogObject } from '../../models/log-object';

const adapter: EntityAdapter<LogObject> = createEntityAdapter<LogObject>();

export type State = EntityState<LogObject>;
export const initialState: State = adapter.getInitialState();

export const logObjectFeature = createFeature({
  name: 'logObject',
  reducer: createReducer(
    initialState,
    on(logObjectActions.set, (state, { log }): State => {
      const { entries, ...rest } = log;
      return adapter.upsertOne({ ...rest, entries: entries.map(({ id }) => id), load: RequestState.Loading }, state);
    }),
    on(
      logObjectActions.geoJsonSuccess,
      (state, { id, geoJson, distance }): State =>
        adapter.updateOne({ id, changes: { geoJson, bbox: bbox(geoJson), load: RequestState.Success, distance } }, state)
    )
  ),
  extraSelectors: ({ selectLogObjectState }) => ({
    ...adapter.getSelectors(selectLogObjectState),
  }),
});
