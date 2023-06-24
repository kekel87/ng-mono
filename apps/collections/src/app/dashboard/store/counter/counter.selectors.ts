import { createSelector } from '@ngrx/store';

import { State, adapter } from '~app/dashboard/store/counter/counter.reducer';
import { LinkState } from '~shared/enums/link-state';

import * as dashboardSelector from '../../dashboard.selectors';

export const { selectEntities } = adapter.getSelectors(dashboardSelector.selectCounter);

export const selectCollectionState = createSelector(dashboardSelector.selectCounter, (state: State) => state.collectionState);
export const selectIsLoading = createSelector(selectCollectionState, (collectionState) => collectionState === LinkState.Loading);
