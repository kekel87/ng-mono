import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { SaveState } from '~shared/enums/save-state';
import { Item } from '~shared/models/item';
import { SupabaseHelperService } from '~shared/services/supabase-helper.service';

import { collectionDetailActions } from './core/store/detail.actions';
import * as collectionsSelectors from '../core/entities/collections.selectors';
import { initCollections } from '../share/utils/init-collections.utils';

interface ItemCollection {
  item: Item;
  collection: Collection;
}

export const detailResolver: ResolveFn<ItemCollection> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const supabase = inject(SupabaseHelperService);
  const collection = route.data['collection'] as Collection;
  const id = route.paramMap.get('id') as string;
  const meta = metas[collection];

  initCollections(store, meta.relations);

  if ('new' === id) {
    store.dispatch(collectionDetailActions.setSaveState({ saveState: SaveState.NotSave }));

    const item = meta.newItem(uuidv4());
    return of({ item, collection });
  }

  return store.select(collectionsSelectors.selectLinkStateFactory(collection)).pipe(
    switchMap((linkState) =>
      linkState === LinkState.Linked ? store.select(collectionsSelectors.selectEntityFactory(collection, id)) : of(undefined)
    ),
    switchMap((item) => (item === undefined ? supabase.findById<Item>(collection, id) : of(item))),
    take(1),
    switchMap((item) => {
      if (item === undefined) {
        store.dispatch(collectionDetailActions.notFound({ collection }));
        return throwError('Item not found');
      }

      store.dispatch(collectionDetailActions.setSaveState({ saveState: SaveState.Unchanged }));
      return of({ item, collection });
    })
  );
};
