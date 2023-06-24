import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State, featureKey } from './dashboard.reducer';

const selectFeature = createFeatureSelector<State>(featureKey);

export const selectCounter = createSelector(selectFeature, (state: State) => state.counter);
