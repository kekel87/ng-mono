import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { entryActions } from './entry.actions';
import { LogService } from '../../services/log.service';

@Injectable()
export class EntryEffects {
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(entryActions.load),
      mergeMap(({ id }) => {
        return this.logService.getEntry(id).pipe(
          map((entry) => entryActions.loadSuccess({ entry })),
          catchError(() => of(entryActions.loadError({ id })))
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private logService: LogService
  ) {}
}
