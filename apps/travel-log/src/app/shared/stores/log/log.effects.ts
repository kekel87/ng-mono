import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';

import { LogService } from './../../services/log.service';
import { logActions } from './log.actions';
import { logObjectActions } from '../log-object/log-object.actions';

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

  setAllLogObjects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logActions.loadSuccess),
      switchMap(({ logs }) => from(logs.map((log) => logObjectActions.set({ log }))))
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
