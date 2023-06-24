import { createSelector } from '@ngrx/store';

import { State } from './detail.reducer';
import * as collectionReducer from '../../../collection.selectors';

export const selectLoading = createSelector(collectionReducer.selectDetail, (state: State) => state.loading);
export const selectSaveState = createSelector(collectionReducer.selectDetail, (state: State) => state.saveState);
