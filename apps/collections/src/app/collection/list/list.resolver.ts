import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';

import * as collectionsSelectors from '../core/entities/collections.selectors';
import { initCollections } from '../share/utils/init-collections.utils';

export const listResolver: ResolveFn<Collection> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const collection = route.paramMap.get('collection') as Collection;
  const collections = [collection, ...metas[collection].relations];

  initCollections(store, collections);
  return combineLatest(
    collections.map((relation) =>
      store.select(collectionsSelectors.selectLinkStateFactory(relation)).pipe(
        filter((linkState) => linkState !== LinkState.Loading),
        first()
      )
    )
  ).pipe(
    filter((v) => v.length > 0),
    map(() => collections[0]),
    first()
  );
};
