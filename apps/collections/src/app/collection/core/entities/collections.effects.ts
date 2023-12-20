import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { LinkState } from '~shared/enums/link-state';
import { Item } from '~shared/models/item';
import { SupabaseService } from '~shared/services/supabase.service';

import { collectionsActions } from './collections.actions';
import * as collectionsSelectors from './collections.selectors';

@Injectable()
export class CollectionsEffects {
  constructor(
    private actions$: Actions,
    private supabaseService: SupabaseService,
    private store: Store
  ) {}

  initDataChange$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(collectionsActions.init),
        mergeMap(({ collection }) =>
          this.supabaseService.onChange<Item>(collection).pipe(
            map((items: Item[]) => collectionsActions.dataChange({ collection, items })),
            catchError((_: unknown) => of(collectionsActions.error({ collection })))
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
          this.supabaseService.save<Item>(collection, item).pipe(
            map(() => collectionsActions.saveSuccess({ collection })),
            catchError((_: unknown) => of(collectionsActions.error({ collection })))
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
          this.supabaseService.delete(collection, id).pipe(
            map(() => collectionsActions.deleteSuccess({ collection })),
            catchError((_: unknown) => of(collectionsActions.error({ collection })))
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );
}
