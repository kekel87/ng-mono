import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { filterActions } from './filter.actions';
import { MeasureType } from '../../api/enums/measure-type';
import { ModuleMesureType } from '../../models/module-measure-type';
import { homeActions } from '../home/home.actions';
import { measureActions } from '../measure/measure.actions';
import { selectModulesWithMeasureType } from '../selectors';

@Injectable()
export class FilterEffects {
  readonly AUTO_REFRESH_DELAY = 600000;

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  initTemperatureMeasureByDefault$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(homeActions.select),
      concatLatestFrom(() => this.store.select(selectModulesWithMeasureType)),
      map(([, modules]) =>
        modules.reduce<ModuleMesureType[]>(
          (acc, { id, measureType }) =>
            measureType.includes(MeasureType.Temperature) ? [...acc, { id, type: MeasureType.Temperature }] : acc,
          []
        )
      ),
      map((moduleMeasureTypes) => filterActions.enableManyModuleMeasure({ moduleMeasureTypes }))
    );
  });

  getMeasureOnEnableModuleMeasure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterActions.enableModuleMeasure),
      map(({ moduleMeasureType }) => measureActions.fetch({ moduleMeasureType }))
    );
  });

  triggerFetchManyMeasures$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        filterActions.enableManyModuleMeasure,
        filterActions.changeIntervalType,
        filterActions.nextInterval,
        filterActions.previousInterval,
        filterActions.refresh
      ),
      map(() => measureActions.fetchMany())
    );
  });

  autoRefresh$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterActions.changeAutoRefresh),
      startWith({ autoRefresh: true }),
      switchMap(() =>
        timer(0, this.AUTO_REFRESH_DELAY).pipe(
          map(() => measureActions.fetchMany()),
          takeUntil(
            this.actions$.pipe(
              ofType(filterActions.changeAutoRefresh),
              filter(({ autoRefresh }) => !autoRefresh)
            )
          )
        )
      )
    );
  });
}
