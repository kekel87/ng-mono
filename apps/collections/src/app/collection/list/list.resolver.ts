import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';

import * as collectionsSelectors from '../core/entities/collections.selectors';
import { InitUtils } from '../share/utils/init.utils';

@Injectable({
  providedIn: 'root',
})
export class ListResolver implements Resolve<Collection> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Collection> {
    const collection = route.paramMap.get('collection') as Collection;
    const collections = [collection, ...metas[collection].relations];

    InitUtils.initCollections(this.store, collections);
    return this.waitForCollections(collections);
  }

  waitForCollections(collections: Collection[]): Observable<Collection> {
    return combineLatest(
      collections.map((relation) =>
        this.store.select(collectionsSelectors.selectLinkStateFactory(relation)).pipe(
          filter((linkState) => linkState !== LinkState.Loading),
          take(1)
        )
      )
    ).pipe(
      filter((v) => v.length > 0),
      map(() => collections[0]),
      take(1)
    );
  }
}
