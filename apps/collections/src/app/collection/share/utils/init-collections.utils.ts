import { Store } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';

import { collectionsActions } from '~app/collection/core/entities/collections.actions';
import { selectLinkStateFactory } from '~app/collection/core/entities/collections.selectors';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';

export function initCollections(store: Store, collections: Collection[]): void {
  collections.map((collection) =>
    store
      .select(selectLinkStateFactory(collection))
      .pipe(
        first(),
        filter((linkState) => linkState !== LinkState.Linked)
      )
      .subscribe(() => {
        store.dispatch(collectionsActions.init({ collection }));
      })
  );
}
