import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State, featureKey } from './collection.reducer';

const selectFeature = createFeatureSelector<State>(featureKey);

export const selectList = createSelector(selectFeature, (state: State) => state.list);
export const selectDetail = createSelector(selectFeature, (state: State) => state.detail);
export const selectCollections = createSelector(selectFeature, (state: State) => state.collections);
