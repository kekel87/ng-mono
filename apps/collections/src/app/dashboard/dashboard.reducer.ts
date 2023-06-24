import { ActionReducerMap } from '@ngrx/store';

import * as counterReducer from './store/counter/counter.reducer';

export const featureKey = 'dashboard';

export interface State {
  [counterReducer.counterFeature.name]: counterReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  [counterReducer.counterFeature.name]: counterReducer.counterFeature.reducer,
};
