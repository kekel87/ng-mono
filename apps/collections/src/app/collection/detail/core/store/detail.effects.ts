import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { layoutActions } from '~app/core/layout/layout.actions';
import { routerActions } from '~app/core/router/router.actions';

import { collectionDetailActions } from './detail.actions';
import { collectionsActions } from '../../../core/entities/collections.actions';

@Injectable()
export class DetailEffects {
  constructor(private actions$: Actions) {}

  goToList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(collectionsActions.deleteSuccess),
      map(({ collection }) => routerActions.navigate({ commands: ['/', collection] }))
    );
  });

  navigateWhenNotFound$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(collectionDetailActions.notFound),
      map(({ collection }) => routerActions.navigate({ commands: ['/', collection] }))
    );
  });

  showMessageWhenNotFound$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(collectionDetailActions.notFound),
      map(() =>
        layoutActions.openSnackbar({
          options: {
            message: '⚠ Element non trouvé !',
            action: 'OK',
          },
        })
      )
    );
  });
}
