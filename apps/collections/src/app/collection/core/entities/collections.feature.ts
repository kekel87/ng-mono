import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { LinkState } from '~shared/enums/link-state';
import { Item } from '~shared/models/item';

import { collectionsActions } from './collections.actions';

interface CollectionState<T extends Item> extends EntityState<T> {
  linkState: LinkState;
}

export const adapter = createEntityAdapter<Item>();

export interface State {
  [key: string]: CollectionState<Item>;
}

export const initialState: State = {};

export const collectionsFeature = createFeature({
  name: 'collections',
  reducer: createReducer(
    initialState,
    on(
      collectionsActions.init,
      (state, { collection }): State => ({
        ...state,
        [collection]: adapter.getInitialState({ linkState: LinkState.Loading }),
      })
    ),
    on(
      collectionsActions.initSuccess,
      (state, { collection }): State => ({
        ...state,
        [collection]: { ...state[collection], linkState: LinkState.Linked },
      })
    ),
    on(
      collectionsActions.dataChange,
      (state, { collection, items }): State => ({
        ...state,
        [collection]: adapter.setAll(items, {
          ...state[collection],
          linkState: LinkState.Linked,
        }),
      })
    ),
    on(
      collectionsActions.error,
      (state, { collection }): State => ({
        ...state,
        [collection]: { ...state[collection], linkState: LinkState.Error },
      })
    )
  ),
});
