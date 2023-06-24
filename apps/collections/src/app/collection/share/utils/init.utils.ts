import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { collectionsActions } from '~app/collection/core/entities/collections.actions';
import { selectLinkStateFactory } from '~app/collection/core/entities/collections.selectors';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';

export abstract class InitUtils {
  static initCollections(store: Store, collections: Collection[]): void {
    collections.map((collection) =>
      store
        .select(selectLinkStateFactory(collection))
        .pipe(
          take(1),
          filter((linkState) => linkState !== LinkState.Linked)
        )
        .subscribe(() => {
          store.dispatch(collectionsActions.init({ collection }));
        })
    );
  }
}
