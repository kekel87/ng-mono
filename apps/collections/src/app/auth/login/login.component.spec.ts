import { FormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { authActions } from '~app/auth/auth.actions';
import { LoginComponent, LoginModule } from '~app/auth/login/login.component';
import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { MockRuntimeConfig } from '~tests/mocks/runtime-config';
import { mockUser } from '~tests/mocks/user';

import * as authSelectors from '../auth.selectors';

describe('LoginComponent', () => {
  let fixture: MockedComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(LoginComponent, LoginModule)
      .keep(FormsModule)
      .provide(
        provideMockStore({
          selectors: [
            { selector: authSelectors.selectUser, value: null },
            { selector: authSelectors.selectLoading, value: false },
          ],
        })
      )
      .provide({ provide: RUNTIME_CONFIG, useValue: MockRuntimeConfig.base });

    fixture = MockRender(LoginComponent, undefined, false);
    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should connect with Google', () => {
      ngMocks.click('button');
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(authActions.googleLogin());
    });

    it('should connect with email', () => {
      ngMocks.change('#email', 'test@test.fr');
      ngMocks.change('#password', '123456');
      ngMocks.click('.dev-auth button');

      expect(store.dispatch).toHaveBeenCalledWith(authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }));
    });

    it('should display loading', () => {
      authSelectors.selectLoading.setResult(true);
      store.refreshState();
      fixture.detectChanges();

      expect(ngMocks.find('col-loader')).not.toBeNull();
    });

    it('should not redirect', () => {
      fixture.detectChanges();

      expect(store.dispatch).not.toHaveBeenCalledWith(authActions.redirect());
    });
  });

  describe('authenticated', () => {
    beforeEach(() => {
      authSelectors.selectUser.setResult(mockUser);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should redirect', () => {
      expect(store.dispatch).toHaveBeenCalledWith(authActions.redirect());
    });
  });
});
