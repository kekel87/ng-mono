import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, first, map, switchMap } from 'rxjs/operators';

import { hasValue, isRecord } from '@ng-mono/shared';
import { routerActions } from '~app/core/router/router.actions';

import { authActions } from './auth.actions';
import { authFeature } from './auth.feature';
import { AuthService } from './auth.service';

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

  login$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.googleLogin),
        switchMap(() =>
          this.authService.signInWithGoogle().pipe(
            map(() => authActions.loginSuccess()),
            catchError((error: unknown) => of(authActions.error(hasMsg(error) ? { error: error.msg } : {})))
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  devLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.emailPasswordLogin),
        switchMap(({ email, password }) =>
          this.authService.signInWithEmailAndPassword(email, password).pipe(
            map(({ error }) => (error ? authActions.error({ error: error.message }) : authActions.loginSuccess())),
            catchError((_: unknown) => of(authActions.error({})))
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  findUserWhenLoginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginSuccess),
      map(() => authActions.findUser())
    );
  });

  redirectWhenLoginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginSuccess),
      map(() => authActions.redirect())
    );
  });

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.findUser),
      concatMap(() => this.authService.user$),
      map((user) => (user ? authActions.findUserSuccess({ user }) : authActions.notAuthenticated({})))
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logout),
        switchMap(() =>
          this.authService.signOut().pipe(
            map(() => authActions.notAuthenticated({})),
            catchError((_: unknown) => of(authActions.error({})))
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  watchError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.findUser),
      switchMap(() => this.authService.error$),
      filter(hasValue),
      map(({ message }) => authActions.error({ error: message }))
    );
  });

  accessDenied$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.error),
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
