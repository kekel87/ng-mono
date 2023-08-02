import { createFeature, createReducer, on } from '@ngrx/store';

import { RequestState } from '@ng-mono/shared';

import { logActions } from './log.actions';

export interface State {
  loadRequestState: RequestState;
}

export const initialState: State = {
  loadRequestState: RequestState.Initial,
};

export const logFeature = createFeature({
  name: 'log',
  reducer: createReducer(
    initialState,
    on(logActions.load, (state): State => ({ ...state, loadRequestState: RequestState.Loading })),
    on(logActions.loadSuccess, (state): State => ({ ...state, loadRequestState: RequestState.Success })),
    on(logActions.loadError, (state): State => ({ ...state, loadRequestState: RequestState.Error }))
  ),
});
