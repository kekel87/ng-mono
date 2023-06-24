import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Subject } from 'rxjs';

import { authActions } from '~app/auth/auth.actions';
import { AuthEffects } from '~app/auth/auth.effets';
import * as authSelectors from '~app/auth/auth.selectors';
import { AppInitService, appInitServiceFactory } from '~app/core/app-init.service';

describe('AppInitService', () => {
  let service: AppInitService;
  let store: MockStore;

  const goToLogin = new Subject<void>();
  const fakeAuthEffects = { goToLogin$: goToLogin };

  beforeEach(async () => {
    await MockBuilder(AppInitService)
      .provide(provideMockStore({ selectors: [{ selector: authSelectors.selectLoading, value: true }] }))
      .provide({ provide: AuthEffects, useValue: fakeAuthEffects });

    service = ngMocks.findInstance(AppInitService);
    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(service).toBeDefined();
    expect(store.dispatch).not.toHaveBeenCalledWith(authActions.findUser());
  });

  it('should dispath GetUser', async () => {
    authSelectors.selectLoading.setResult(false);
    store.refreshState();
    await service.onAppInit();
    expect(store.dispatch).toHaveBeenCalledWith(authActions.findUser());
  });

  it('should call onAppInit', () => {
    jest.spyOn(service, 'onAppInit');
    const factory = appInitServiceFactory(service);
    expect(factory).toBeDefined();
    factory();
    expect(service.onAppInit).toHaveBeenCalled();
  });
});
