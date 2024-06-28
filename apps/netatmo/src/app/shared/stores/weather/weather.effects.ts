import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, switchMap, map, filter } from 'rxjs/operators';

import { weatherActions } from './weather.actions';
import { WeatherService } from '../../api/servives/weather.service';
import { hasValue } from '../../utils/type-guards';
import { weatherHourlyToMesureSource } from '../../utils/weather-response-hourly-to-measure-source';
import { measureActions } from '../measure/measure.actions';
import { selectWheaterParams } from '../selectors';

@Injectable()
export class WeatherEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private weatherService: WeatherService
  ) {}

  fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(weatherActions.fetch),
      concatLatestFrom(() => this.store.select(selectWheaterParams)),
      map(([, wheaterParams]) => wheaterParams),
      filter(hasValue),
      switchMap((wheaterParams) =>
        this.weatherService.get(wheaterParams).pipe(
          map((response) => weatherActions.fetchSuccess({ response })),
          catchError(() => of(weatherActions.fetchError()))
        )
      )
    );
  });

  toMeasure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(weatherActions.fetchSuccess),
      map(({ response }) => weatherHourlyToMesureSource(response.hourly)),
      map((measures) => measureActions.upsertMany({ measures }))
    );
  });
}
