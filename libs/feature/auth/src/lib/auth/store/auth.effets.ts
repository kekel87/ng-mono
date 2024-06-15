import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, first, map, switchMap } from 'rxjs/operators';

import { hasValue, isRecord, routerActions } from '@ng-mono/shared/utils';

import { authActions } from './auth.actions';
import { authFeature } from './auth.feature';
import { AuthService } from '../services/auth.service';

export function hasMsg(input: unknown): input is { msg: string } {
  return isRecord(input) && 'msg' in input;
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store
  ) {}

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.init),
      concatMap(() => {
        this.authService.init();
        return this.authService.user$;
      }),
      map((user) => (user ? authActions.setUser({ user }) : authActions.notAuthenticated({})))
    );
  });

  watchError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.init),
      switchMap(() => this.authService.error$),
      filter(hasValue),
      map(({ message }) => authActions.setError({ error: message }))
    );
  });

  googleLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.googleLogin),
      switchMap(() =>
        this.authService.signInWithGoogle().pipe(
          map(() => authActions.loginSuccess()),
          catchError((error: unknown) => of(authActions.setError(hasMsg(error) ? { error: error.msg } : {})))
        )
      )
    );
  });

  emailPasswordLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.emailPasswordLogin),
      switchMap(({ email, password }) =>
        this.authService.signInWithEmailAndPassword(email, password).pipe(
          map(({ error }) => (error ? authActions.setError({ error: error.message }) : authActions.loginSuccess())),
          catchError(() => of(authActions.setError({})))
        )
      )
    );
  });

  redirectOnLoginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginSuccess),
      map(() => authActions.redirect())
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.logout),
      switchMap(() =>
        this.authService.signOut().pipe(
          map(() => authActions.notAuthenticated({})),
          catchError(() => of(authActions.setError({})))
        )
      )
    );
  });

  accessDenied$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.setError),
      filter(({ error }) => error === 'invalid claim: missing sub claim'),
      map(() => routerActions.navigate({ commands: ['/access-denied'] }))
    );
  });

  goToLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.notAuthenticated),
      map(() => routerActions.navigate({ commands: ['/login'] }))
    );
  });

  redirect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.redirect),
      concatMap(() => this.store.select(authFeature.selectRedirectUrl).pipe(first())),
      map((redirectUrl) => routerActions.navigate({ commands: [redirectUrl] }))
    );
  });
}
