import { ActionReducerMap } from '@ngrx/store';

import * as collectionsReducer from './core/entities/collections.reducer';
import * as detailReducer from './detail/core/store/detail.reducer';
import * as listReducer from './list/list.reducer';

export const featureKey = 'collection';

export interface State {
  [detailReducer.detailFeature.name]: detailReducer.State;
  [listReducer.listFeature.name]: listReducer.State;
  [collectionsReducer.collectionsFeature.name]: collectionsReducer.State;
}

export const reducer: ActionReducerMap<State> = {
  [detailReducer.detailFeature.name]: detailReducer.detailFeature.reducer,
  [listReducer.listFeature.name]: listReducer.listFeature.reducer,
  [collectionsReducer.collectionsFeature.name]: collectionsReducer.collectionsFeature.reducer,
};
