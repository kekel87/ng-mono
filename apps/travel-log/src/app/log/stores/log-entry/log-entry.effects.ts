import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { logEntryActions } from './log-entry.actions';
import { LogService } from '../../services/log.service';

@Injectable()
export class LogEntryEffects {
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logEntryActions.load),
      mergeMap(({ id }) => {
        return this.logService.getLogEntry(id).pipe(
          map((entry) => logEntryActions.loadSuccess({ entry })),
          catchError(() => of(logEntryActions.loadError({ id })))
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private logService: LogService
  ) {}
}
