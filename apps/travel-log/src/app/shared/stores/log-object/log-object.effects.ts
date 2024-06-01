import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { RequestState, hasValue, merge } from '@ng-mono/shared/utils';

import { logObjectActions } from './log-object.actions';
import { logEntryObjectActions } from '../log-entry-object/log-entry-object.actions';
import { logEntryObjectFeature } from '../log-entry-object/log-entry-object.feature';

@Injectable()
export class LogObjectEffects {
  setAllLogEntries$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logObjectActions.set),
      switchMap(({ log }) => from(log.entries.map((logEntry) => logEntryObjectActions.set({ logEntry, logId: log.id }))))
    );
  });

  combineGeoJsonOnAllLogEntryLoadFileSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logEntryObjectActions.loadFileSuccess),
      concatLatestFrom(() => this.store.select(logEntryObjectFeature.selectEntities)),
      map(([{ id }, logEntryObjectEntities]) => logEntryObjectEntities[id]),
      filter(hasValue),
      concatLatestFrom(() => this.store.select(logEntryObjectFeature.selectAll)),
      map(([{ logId }, logEntryObjects]) =>
        logEntryObjects.reduce(
          (acc, curr) =>
            curr.logId !== logId
              ? acc
              : {
                  ...acc,
                  requestStates: [...acc.requestStates, curr.load],
                  // TODO: Maybe a can make a selector for this or a pipe
                  geoJson:
                    curr.load === RequestState.Success && curr.geoJson
                      ? {
                          ...curr.geoJson,
                          features: [...acc.geoJson.features, ...curr.geoJson.features],
                        }
                      : acc.geoJson,
                  distance: acc.distance + (curr.distance ?? 0),
                },
          { id: logId, requestStates: [], geoJson: { features: [] }, distance: 0 } as {
            id: string;
            requestStates: RequestState[];
            geoJson: { features: any[] };
            distance: number;
          }
        )
      ),
      filter(({ requestStates }) => merge(requestStates) === RequestState.Success),
      map(({ id, geoJson, distance }) => logObjectActions.geoJsonSuccess({ id, geoJson, distance }))
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}
}
