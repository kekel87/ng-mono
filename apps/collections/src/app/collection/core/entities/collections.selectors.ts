import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { Item } from '~shared/models/item';

import { State, adapter, collectionsFeature } from './collections.feature';

const { selectEntities: getEntities, selectAll: getAll } = adapter.getSelectors();

const getAllCollectionEntities = <T extends Item>(state: State, collection: Collection): Dictionary<T> =>
  state[collection] ? (getEntities(state[collection]) as Dictionary<T>) : {};

export const selectEntityFactory = <T extends Item>(collection: Collection, id: string) =>
  createSelector(
    collectionsFeature.selectCollectionsState,
    (state: State) => getAllCollectionEntities<T>(state, collection)[id] || undefined
  );

export const selectLinkStateFactory = (collection: Collection) =>
  createSelector(
    collectionsFeature.selectCollectionsState,
    (state: State): LinkState => (state[collection] ? state[collection].linkState : LinkState.Initial)
  );

const getAllCollection = <T extends Item>(state: State, collection: Collection): T[] =>
  state[collection] ? (getAll(state[collection]) as T[]) : [];

export const selectAllFactory = <T extends Item>(collection: Collection) =>
  createSelector(collectionsFeature.selectCollectionsState, (state: State) => getAllCollection<T>(state, collection));

export const selectCollectionFactory = <T extends Item>(collection: Collection) =>
  createSelector(collectionsFeature.selectCollectionsState, (state: State) => {
    const meta = metas[collection];
    if (meta && meta.relations.length) {
      return [getAllCollection<T>(state, collection), ...meta.relations.map((r) => getAllCollectionEntities<T>(state, r))];
    }
    return getAllCollection<T>(state, collection);
  });
