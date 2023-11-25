import { Injectable } from '@angular/core';
import { RouterEvent } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { layoutActions } from './layout.actions';
import { layoutFeature } from './layout.feature';

@Injectable()
export class LayoutEffects {
  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  resetToolbar$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(() => layoutActions.resetToolbar())
    );
  });

  closeSearchBar$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      concatLatestFrom(() => this.store.select(layoutFeature.selectShowSearchBar)),
      filter(([_, show]: [RouterEvent, boolean]) => show),
      map(() => layoutActions.closeSearchBar())
    );
  });
}
