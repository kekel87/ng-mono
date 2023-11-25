import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';

import * as collectionsSelectors from '../core/entities/collections.selectors';
import { initCollections } from '../share/utils/init-collections.utils';

@Injectable({
  providedIn: 'root',
})
export class ListResolver {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Collection> {
    const collection = route.paramMap.get('collection') as Collection;
    const collections = [collection, ...metas[collection].relations];

    initCollections(this.store, collections);
    return this.waitForCollections(collections);
  }

  waitForCollections(collections: Collection[]): Observable<Collection> {
    return combineLatest(
      collections.map((relation) =>
        this.store.select(collectionsSelectors.selectLinkStateFactory(relation)).pipe(
          filter((linkState) => linkState !== LinkState.Loading),
          first()
        )
      )
    ).pipe(
      filter((v) => v.length > 0),
      map(() => collections[0]),
      first()
    );
  }
}
