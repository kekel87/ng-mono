import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { SaveState } from '~shared/enums/save-state';
import { Item } from '~shared/models/item';
import { FirestoreService } from '~shared/services/firestore.service';

import { collectionDetailActions } from './core/store/detail.actions';
import * as collectionsSelectors from '../core/entities/collections.selectors';
import { InitUtils } from '../share/utils/init.utils';

interface ItemCollection {
  item: Item;
  collection: Collection;
}

@Injectable({
  providedIn: 'root',
})
export class DetailResolver {
  constructor(
    private store: Store,
    private service: FirestoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ItemCollection> {
    const collection = route.data['collection'] as Collection;
    const id = route.paramMap.get('id') as string;
    const meta = metas[collection];

    InitUtils.initCollections(this.store, meta.relations);

    if ('new' === id) {
      this.store.dispatch(collectionDetailActions.setSaveState({ saveState: SaveState.NotSave }));

      const item = meta.newItem(this.service.createId());
      return of({ item, collection });
    }

    return this.store.select(collectionsSelectors.selectLinkStateFactory(collection)).pipe(
      switchMap((linkState) =>
        linkState === LinkState.Linked ? this.store.select(collectionsSelectors.selectEntityFactory(collection, id)) : of(undefined)
      ),
      switchMap((item) => (item === undefined ? this.service.findById<Item>(collection, id) : of(item))),
      take(1),
      switchMap((item) => {
        if (item === undefined) {
          this.store.dispatch(collectionDetailActions.notFound({ collection }));
          return throwError('Item not found');
        }

        this.store.dispatch(collectionDetailActions.setSaveState({ saveState: SaveState.Unchanged }));
        return of({ item, collection });
      })
    );
  }
}
