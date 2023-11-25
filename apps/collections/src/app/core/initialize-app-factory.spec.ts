import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { authActions } from '~app/auth/auth.actions';
import { initializeAppFactory } from '~app/core/initialize-app-factory';

describe('initializeAppFactory', () => {
  const store = { dispatch: jest.fn(), select: jest.fn() };
  let initializeAppFn: () => Observable<boolean>;

  beforeEach(async () => {
    initializeAppFn = initializeAppFactory(store as unknown as Store);
  });

  it('should be created', () => {
    expect(initializeAppFn).toBeDefined();
  });

  it('should dispath GetUser and wait stop loading to resolve', () => {
    store.select.mockReturnValue(cold('-a--b-', { a: true, b: false }));

    expect(initializeAppFn()).toBeObservable(cold('----(a|)-', { a: false }));
    expect(store.dispatch).toHaveBeenCalledWith(authActions.findUser());
  });
});
