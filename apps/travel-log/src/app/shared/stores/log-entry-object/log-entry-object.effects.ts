import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { logEntryObjectActions } from './log-entry-object.actions';
import { LogService } from '../../services/log.service';

@Injectable()
export class LogEntryObjectEffects {
  loadFileOnSet$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logEntryObjectActions.set),
      map(({ logEntry }) => logEntryObjectActions.loadFile({ id: logEntry.id, url: logEntry.gpx }))
    );
  });

  loadFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logEntryObjectActions.loadFile),
      mergeMap(({ id, url }) => {
        return this.logService.loadGpx(url).pipe(
          map((file) => logEntryObjectActions.loadFileSuccess({ id, file })),
          catchError(() => of(logEntryObjectActions.loadFileError({ id })))
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private logService: LogService
  ) {}
}
