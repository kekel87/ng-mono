import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on, createSelector } from '@ngrx/store';

import { RequestState } from '@ng-mono/shared/utils';

import { homeActions } from './home.actions';
import { Home } from '../../api/models/home';

export interface State extends EntityState<Home> {
  selected: string | null;
  requestState: RequestState;
}

const adapter: EntityAdapter<Home> = createEntityAdapter<Home>({
  sortComparer: (a: Home, b: Home): number => a.name.localeCompare(b.name),
});

const initialState: State = adapter.getInitialState({
  selected: null,
  requestState: RequestState.Initial,
});

export const homeFeature = createFeature({
  name: 'home',
  reducer: createReducer(
    initialState,
    on(homeActions.fetch, (state): State => ({ ...state, requestState: RequestState.Loading })),
    on(
      homeActions.fetchSuccess,
      (state, { homeData }): State => adapter.setAll(homeData.homes, { ...state, requestState: RequestState.Success })
    ),
    on(homeActions.fetchError, (state): State => ({ ...state, requestState: RequestState.Error })),
    on(homeActions.select, (state, { id }): State => ({ ...state, selected: id }))
  ),
  extraSelectors: ({ selectHomeState, selectEntities, selectSelected }) => ({
    ...adapter.getSelectors(selectHomeState),
    selectHome: createSelector(selectEntities, selectSelected, (entities, selected) =>
      selected && entities[selected] ? entities[selected] : undefined
    ),
  }),
});
