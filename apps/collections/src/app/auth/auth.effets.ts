import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, first, map, switchMap } from 'rxjs/operators';

import { routerActions } from '~app/core/router/router.actions';
import { isFirebaseError } from '~shared/utils/type-guards';

import { authActions } from './auth.actions';
import { authFeature } from './auth.feature';
import { AuthService } from './auth.service';

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
            catchError((error: unknown) => of(authActions.error(isFirebaseError(error) ? { error: error.code } : {})))
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
            map(() => authActions.loginSuccess()),
            catchError((error: unknown) => of(authActions.error(isFirebaseError(error) ? { error: error.code } : {})))
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
            catchError((error: unknown) => of(authActions.error(isFirebaseError(error) ? { error: error.code } : {})))
          )
        )
      );
    },
    { useEffectsErrorHandler: false }
  );

  disabled$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.error),
      filter(({ error }) => error === 'auth/user-disabled'),
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
