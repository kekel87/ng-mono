import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { measureActions } from './measure.actions';
import { MeasureType } from '../../api/enums/measure-type';
import { Measure } from '../../api/models/measure';
import { NetatmoService } from '../../api/servives/netatmo.service';
import { Interval } from '../../models/interval';
import { MeasureSource } from '../../models/measure-source';
import { ModuleWithEnabledMeasureTypes } from '../../models/module-with-enabled-measure-types copy';
import { dateToUnixTimestamp } from '../../utils/date-to-unix-timestamp';
import { filterFeature } from '../filter/filter.reducer';
import { selectModules } from '../selectors';

@Injectable()
export class MeasureEffects {
  constructor(private actions$: Actions, private store: Store, private netamoService: NetatmoService) {}

  fetchMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(measureActions.fetchMany),
      concatLatestFrom(() => [this.store.select(filterFeature.selectAll), this.store.select(selectModules)]),
      map(([, enabledModuleMeasureTypes, modules]) => {
        // aka selectModuleWithEnabledMeasureType
        const groupByModule = enabledModuleMeasureTypes.reduce<{ [id: string]: MeasureType[] }>(
          (acc, { id, type }) => ({ ...acc, [id]: [...(acc[id] ?? []), type] }),
          {}
        );

        return modules.map((m) => ({ ...m, enabledMeasureTypes: groupByModule[m.id] }));
      }),
      concatLatestFrom(() => this.store.select(filterFeature.selectInterval)),
      switchMap(([modules, interval]) =>
        forkJoin(modules.map((m) => this.getModuleMeasureDataSetSource(m, interval))).pipe(
          map((measures) => measures.flat()),
          map((measures) => measureActions.fetchSuccess({ measures })),
          catchError(() => of(measureActions.fetchError()))
        )
      )
    );
  });

  private getModuleMeasureDataSetSource(module: ModuleWithEnabledMeasureTypes, interval: Interval): Observable<MeasureSource[]> {
    return this.netamoService
      .getMeasure({
        module_id: module.id,
        device_id: module.bridge ?? module.id,
        type: module.enabledMeasureTypes,
        scale: interval.scale,
        date_begin: dateToUnixTimestamp(interval.begin),
        date_end: dateToUnixTimestamp(interval.end),
      })
      .pipe(map(({ body }) => this.toDataSetSource(module, body)));
  }

  private toDataSetSource(module: ModuleWithEnabledMeasureTypes, measures: Measure[]): MeasureSource[] {
    return measures.reduce<MeasureSource[]>(
      (acc, { beg_time, step_time, value }) => [
        ...acc,
        ...value.map(
          ([temperature], index): MeasureSource => ({
            id: module.id,
            timestamp: new Date((beg_time + index * (step_time ?? 1)) * 1000).toISOString(),
            [MeasureType.Temperature]: temperature,
          })
        ),
      ],
      []
    );
  }
}
