import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { RequestState } from '@ng-mono/shared/utils';

import { logActions } from './log.actions';
import { Log } from '../../models/log';

export interface State extends EntityState<Log> {
  loadRequestState: RequestState;
  saveRequestState: RequestState;
}

const adapter: EntityAdapter<Log> = createEntityAdapter<Log>();
const initialState: State = adapter.getInitialState({
  loadRequestState: RequestState.Initial,
  saveRequestState: RequestState.Initial,
});

export const logFeature = createFeature({
  name: 'log',
  reducer: createReducer(
    initialState,

    on(logActions.load, (state): State => ({ ...state, loadRequestState: RequestState.Loading })),
    on(logActions.loadSuccess, (state, { logs }): State => adapter.upsertMany(logs, { ...state, loadRequestState: RequestState.Success })),
    on(logActions.loadError, (state): State => ({ ...state, loadRequestState: RequestState.Error })),

    on(logActions.save, (state): State => ({ ...state, saveRequestState: RequestState.Loading })),
    on(logActions.saveSuccess, (state, { log }): State => adapter.upsertOne(log, { ...state, saveRequestState: RequestState.Success })),
    on(logActions.saveError, (state): State => ({ ...state, saveRequestState: RequestState.Error }))
  ),
  extraSelectors: ({ selectLogState }) => ({
    ...adapter.getSelectors(selectLogState),
  }),
});
