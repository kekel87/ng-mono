import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { isoStringToUnixTimestamp } from '@ng-mono/shared/utils';

import { measureActions } from './measure.actions';
import { Measure } from '../../api/models/measure';
import { NetatmoService } from '../../api/servives/netatmo.service';
import { MeasureSource } from '../../enums/mesure-source';
import { Interval } from '../../models/interval';
import { MeasureEntry } from '../../models/measure-entry';
import { ModuleWithEnabledMeasureTypes } from '../../models/module-with-enabled-measure-types';
import { filterFeature } from '../filter/filter.reducer';
import { selectModuleWithEnabledMeasureType } from '../selectors';

@Injectable()
export class MeasureEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private netamoService: NetatmoService
  ) {}

  fetchMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(measureActions.fetchMany),
      concatLatestFrom(() => [this.store.select(selectModuleWithEnabledMeasureType), this.store.select(filterFeature.selectInterval)]),
      switchMap(([, modules, interval]) =>
        forkJoin(modules.map((m) => this.getModuleMeasureDataSetSource(m, interval))).pipe(
          map((measures) => measures.flat()),
          map((measures) => measureActions.fetchSuccess({ measures })),
          catchError(() => of(measureActions.fetchError()))
        )
      )
    );
  });

  fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(measureActions.fetch),
      concatLatestFrom(() => [this.store.select(selectModuleWithEnabledMeasureType), this.store.select(filterFeature.selectInterval)]),
      switchMap(([{ moduleMeasureType }, modules, interval]) => {
        const module = modules.find((m) => m.id === moduleMeasureType.id);

        if (!module) {
          return of(measureActions.fetchError());
        }

        return this.getModuleMeasureDataSetSource(module, interval).pipe(
          map((measures) => measureActions.fetchSuccess({ measures })),
          catchError(() => of(measureActions.fetchError()))
        );
      })
    );
  });

  private getModuleMeasureDataSetSource(module: ModuleWithEnabledMeasureTypes, interval: Interval): Observable<MeasureEntry[]> {
    if (module.measureSource === MeasureSource.Measure) {
      return this.netamoService
        .getMeasure({
          module_id: module.id,
          device_id: module.bridge ?? module.id,
          type: module.enabledMeasureTypes.join(','),
          scale: interval.scale,
          date_begin: isoStringToUnixTimestamp(interval.begin),
          date_end: isoStringToUnixTimestamp(interval.end),
        })
        .pipe(map(({ body }) => this.toDataSetSource(module, body)));
    }

    return this.netamoService
      .getRoomMeasure({
        home_id: '5f8dcf5f2827f313353b08f3',
        room_id: module.room_id,
        type: module.enabledMeasureTypes.join(','),
        scale: interval.scale,
        date_begin: isoStringToUnixTimestamp(interval.begin),
        date_end: isoStringToUnixTimestamp(interval.end),
      })
      .pipe(map(({ body }) => this.toDataSetSource(module, body)));
  }

  private toDataSetSource(module: ModuleWithEnabledMeasureTypes, measures: Measure[]): MeasureEntry[] {
    return measures.reduce<MeasureEntry[]>(
      (acc, { beg_time, step_time, value }) => [
        ...acc,
        ...value.map(
          (values, index): MeasureEntry => ({
            id: module.id,
            timestamp: new Date((beg_time + index * (step_time ?? 1)) * 1000).toISOString(),
            ...module.enabledMeasureTypes.reduce((acc, type, index) => ({ ...acc, [type]: values[index] }), {}),
          })
        ),
      ],
      []
    );
  }
}
