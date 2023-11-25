import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { authActions } from './auth.actions';
import { authFeature } from './auth.feature';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private store: Store) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(authFeature.selectIsLoggedIn).pipe(
      first(),
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.store.dispatch(authActions.notAuthenticated({ redirectUrl: state.url }));
        }
      })
    );
  }
}
