import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { authActions } from '../store/auth.actions';
import { authFeature } from '../store/auth.feature';

export const isAuthCanActivate: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const store = inject(Store);
  return store.select(authFeature.selectIsLoggedIn).pipe(
    first(),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        store.dispatch(authActions.notAuthenticated({ redirectUrl: state.url }));
      }
      return isLoggedIn;
    })
  );
};

export const isNotAuthCanActivate: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> => {
  const store = inject(Store);
  return store.select(authFeature.selectIsLoggedIn).pipe(
    first(),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        store.dispatch(authActions.redirect());
      }
      return !isLoggedIn;
    })
  );
};
