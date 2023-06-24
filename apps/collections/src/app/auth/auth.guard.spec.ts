import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { authActions } from './auth.actions';
import { AuthGuard } from './auth.guard';
import * as authSelectors from './auth.selectors';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(AuthGuard).provide(
      provideMockStore({
        selectors: [{ selector: authSelectors.selectIsLoggedIn, value: false }],
      })
    );

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
    guard = ngMocks.findInstance(AuthGuard);
  });

  it('should activate with user', () => {
    authSelectors.selectIsLoggedIn.setResult(true);
    store.refreshState();

    guard.canActivate(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot).subscribe((v) => {
      expect(v).toEqual(true);
    });
  });

  it('should dispatch NotAuthenticated with redirect url without user', () => {
    guard.canActivate(new ActivatedRouteSnapshot(), { url: '/redirect' } as RouterStateSnapshot).subscribe(() => {
      expect(store.dispatch).toHaveBeenCalledWith(authActions.notAuthenticated({ redirectUrl: '/redirect' }));
    });
  });
});
