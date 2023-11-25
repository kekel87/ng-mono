import { createSelector } from '@ngrx/store';

import { layoutFeature } from '~app/core/layout/layout.feature';
import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';

import { selectCollectionFactory } from '../core/entities/collections.selectors';

const selectItemToDisplayFactory = (collection: Collection) =>
  createSelector(selectCollectionFactory(collection), (items) => metas[collection].toItemsDisplay(items));

export const selectItemsFactory = (collection: Collection) =>
  createSelector(selectItemToDisplayFactory(collection), layoutFeature.selectSearch, (items, search) =>
    (search ? items.filter((item) => item.predicate.includes(search)) : items).sort((i1, i2) => i1.title.localeCompare(i2.title))
  );
