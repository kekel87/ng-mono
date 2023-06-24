import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { routerActions } from '~app/core/router/router.actions';
import { LinkState } from '~shared/enums/link-state';
import { FirestoreService } from '~shared/services/firestore.service';
import { isFirebaseError } from '~shared/utils/type-guards';

import { counterActions } from './counter.actions';
import { Counter } from './counter.model';
import * as counterSelectors from './counter.selectors';

@Injectable()
export class CounterEffects implements OnInitEffects {
  initDataChange$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(counterActions.init),
        switchMap(() =>
          this.service.onChange<Counter>('counters').pipe(
            map((counters: Counter[]) => counterActions.dataChange({ counters })),
            catchError((error: unknown) => of(counterActions.error(isFirebaseError(error) ? { error: error.code } : {})))
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  initSuccesWhenDataChangeAndNotLinked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(counterActions.dataChange),
      concatLatestFrom(() => this.store.select(counterSelectors.selectCollectionState)),
      filter(([, collectionState]) => collectionState !== LinkState.Linked),
      map(() => counterActions.initSuccess())
    );
  });

  permissionDenied$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(counterActions.error),
      filter(({ error }) => error === 'permission-denied'),
      map(() => routerActions.navigate({ commands: ['/access-denied'] }))
    );
  });

  constructor(private actions$: Actions, private service: FirestoreService, private store: Store) {}

  ngrxOnInitEffects(): Action {
    return counterActions.init();
  }
}
