import { RequestState } from '@ng-mono/shared/utils';
import { createFeature, createReducer, on } from '@ngrx/store';

import { weatherActions } from './weather.actions';

export interface State {
  requestState: RequestState;
}

const initialState: State = {
  requestState: RequestState.Initial,
};

export const weatherFeature = createFeature({
  name: 'wheather',
  reducer: createReducer(
    initialState,
    on(weatherActions.fetch, (state): State => ({ ...state, requestState: RequestState.Loading })),
    on(weatherActions.fetchSuccess, (state): State => ({ ...state, requestState: RequestState.Success })),
    on(weatherActions.fetchError, (state): State => ({ ...state, requestState: RequestState.Error }))
  ),
});
