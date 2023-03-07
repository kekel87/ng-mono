import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { filterActions } from './filter.actions';
import { MeasureType } from '../../api/enums/measure-type';
import { ModuleMesureType } from '../../models/module-measure-type';
import { homeActions } from '../home/home.actions';
import { selectModulesWithMeasureType } from '../selectors';

@Injectable()
export class FilterEffects {
  constructor(private actions$: Actions, private store: Store) {}

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
}
