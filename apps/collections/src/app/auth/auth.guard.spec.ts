import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { authActions } from './auth.actions';
import { authFeature } from './auth.feature';
import { canActivate } from './auth.guard';

describe('canActivate', () => {
  let activatedRouteSnapshot: ActivatedRouteSnapshot;
  const redirectUrl = '/redicrect';
  const routerStateSnapshot = { url: redirectUrl } as RouterStateSnapshot;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder().provide(
      provideMockStore({
        selectors: [{ selector: authFeature.selectIsLoggedIn, value: false }],
      })
    );

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should activate with user', () => {
    authFeature.selectIsLoggedIn.setResult(true);
    store.refreshState();

    expect(TestBed.runInInjectionContext(() => canActivate(activatedRouteSnapshot, routerStateSnapshot))).toBeObservable(
      cold('(a|)', { a: true })
    );
  });

  it('should dispatch NotAuthenticated with redirect url without user', () => {
    expect(TestBed.runInInjectionContext(() => canActivate(activatedRouteSnapshot, routerStateSnapshot))).toBeObservable(
      cold('(a|)', { a: false })
    );
    expect(store.dispatch).toHaveBeenCalledWith(authActions.notAuthenticated({ redirectUrl }));
  });
});
