import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { routerActions } from './router.actions';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private router: Router, private ngZone: NgZone) {}

  navigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerActions.navigate),
        switchMap(({ commands, extras }) => from(this.ngZone.run(() => this.router.navigate(commands, extras))))
      );
    },
    { dispatch: false }
  );
}
