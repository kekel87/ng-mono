import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { logActions } from './log.actions';
import { LogService } from '../../services/log.service';

@Injectable()
export class LogEffects implements OnInitEffects {
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logActions.load),
      switchMap(() => {
        return this.logService.getLogs().pipe(
          map((logs) => logActions.loadSuccess({ logs })),
          catchError(() => of(logActions.loadError()))
        );
      })
    );
  });

  save$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logActions.saveLogAndEntries),
      switchMap(({ log, entries }) => {
        return this.logService.saveLog(log).pipe(
          switchMap((log) => forkJoin(entries.map((entry) => this.logService.saveEntry({ ...entry, log: log.id }))).pipe(map(() => log))),
          map((log) => logActions.saveSuccess({ log })),
          catchError(() => of(logActions.saveError()))
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private logService: LogService
  ) {}

  ngrxOnInitEffects(): Action {
    return logActions.load();
  }
}
