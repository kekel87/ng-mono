import { createSelector } from '@ngrx/store';

import * as layoutSelectors from '~app/core/layout/layout.selectors';
import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';

import { State } from './list.reducer';
import * as collectionSelectors from '../collection.selectors';
import { selectCollectionFactory } from '../core/entities/collections.selectors';

export const selectScrollIndex = createSelector(collectionSelectors.selectList, (state: State) => state.scrollIndex);

const selectItemToDisplayFactory = (collection: Collection) =>
  createSelector(selectCollectionFactory(collection), (items) => metas[collection].toItemsDisplay(items));

export const selectItemsFactory = (collection: Collection) =>
  createSelector(selectItemToDisplayFactory(collection), layoutSelectors.selectSearch, (items, search) =>
    (search ? items.filter((item) => item.predicate.includes(search)) : items).sort((i1, i2) => i1.title.localeCompare(i2.title))
  );
