import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';

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

  constructor(
    private actions$: Actions,
    private logService: LogService
  ) {}

  ngrxOnInitEffects(): Action {
    return logActions.load();
  }
}
