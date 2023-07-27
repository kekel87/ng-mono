import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map, filter } from 'rxjs/operators';

import { homeActions } from './home.actions';
import { NetatmoService } from '../../api/servives/netatmo.service';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private netatmoService: NetatmoService
  ) {}

  fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(homeActions.fetch),
      switchMap(() =>
        this.netatmoService.getHomesData().pipe(
          map(({ body }) => homeActions.fetchSuccess({ homeData: body })),
          catchError(() => of(homeActions.fetchError()))
        )
      )
    );
  });

  selectDefaultHome$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(homeActions.fetchSuccess),
      filter(({ homeData }) => !!homeData.homes[0]?.id),
      map(({ homeData }) => homeActions.select({ id: homeData.homes[0]?.id }))
    );
  });
}
