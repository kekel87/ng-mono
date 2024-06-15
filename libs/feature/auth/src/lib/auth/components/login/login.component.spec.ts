import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';

import { LoginComponent } from './login.component';
import { authActions } from '../../store/auth.actions';
import { authFeature } from '../../store/auth.feature';

describe('LoginComponent', () => {
  let fixture: MockedComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(LoginComponent).keep(NG_MOCKS_ROOT_PROVIDERS).keep(FormsModule).keep(ReactiveFormsModule).provide(provideMockStore());

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
      ngMocks.click('.providers button');
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(authActions.googleLogin());
    });

    it('should connect with email', () => {
      ngMocks.change('[formControlName="email"]', 'test@test.fr');
      ngMocks.change('[formControlName="password"]', '123456');

      ngMocks.output('form', 'ngSubmit').emit();

      expect(store.dispatch).toHaveBeenCalledWith(authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }));
    });

    it('should display loading', () => {
      authFeature.selectLoading.setResult(true);
      store.refreshState();
      fixture.detectChanges();

      expect(ngMocks.find('full-page-loader')).not.toBeNull();
    });

    it('should not redirect', () => {
      fixture.detectChanges();

      expect(store.dispatch).not.toHaveBeenCalledWith(authActions.redirect());
    });
  });
});
