import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { routerActions } from '~app/core/router/router.actions';
import { LinkState } from '~shared/enums/link-state';
import { Item } from '~shared/models/item';
import { FirestoreService } from '~shared/services/firestore.service';
import { isFirebaseError } from '~shared/utils/type-guards';

import { collectionsActions } from './collections.actions';
import * as collectionsSelectors from './collections.selectors';

@Injectable()
export class CollectionsEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private store: Store
  ) {}

  initDataChange$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(collectionsActions.init),
        mergeMap(({ collection }) =>
          this.firestoreService.onChange<Item>(collection).pipe(
            map((items: Item[]) => collectionsActions.dataChange({ collection, items })),
            catchError((error: unknown) =>
              of(collectionsActions.error({ collection, ...(isFirebaseError(error) ? { error: error.code } : {}) }))
            )
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  initSuccesWhenDataChangeAndNotLinked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(collectionsActions.dataChange),
      concatLatestFrom(({ collection }) => this.store.select(collectionsSelectors.selectLinkStateFactory(collection))),
      filter(([, linkState]) => linkState !== LinkState.Linked),
      map(([{ collection }]) => collectionsActions.initSuccess({ collection }))
    );
  });

  save$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(collectionsActions.save),
        switchMap(({ collection, item }) =>
          this.firestoreService.save<Item>(collection, item).pipe(
            map(() => collectionsActions.saveSuccess({ collection })),
            catchError((error: unknown) =>
              of(collectionsActions.error({ collection, ...(isFirebaseError(error) ? { error: error.code } : {}) }))
            )
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  delete$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(collectionsActions.delete),
        concatMap(({ collection, id }) =>
          this.firestoreService.delete(collection, id).pipe(
            map(() => collectionsActions.deleteSuccess({ collection })),
            catchError((error: unknown) =>
              of(collectionsActions.error({ collection, ...(isFirebaseError(error) ? { error: error.code } : {}) }))
            )
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  permissionDenied$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(collectionsActions.error),
      filter(({ error }) => error === 'permission-denied'),
      map(() => routerActions.navigate({ commands: ['/access-denied'] }))
    );
  });
}
