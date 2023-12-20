import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { authActions } from './auth.actions';
import { authFeature } from './auth.feature';

export const canActivate: CanActivateFn = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const store = inject(Store);
  return store.select(authFeature.selectIsLoggedIn).pipe(
    first(),
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        store.dispatch(authActions.notAuthenticated({ redirectUrl: state.url }));
      }
    })
  );
};
