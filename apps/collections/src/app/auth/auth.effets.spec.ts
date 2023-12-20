import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthError } from '@supabase/supabase-js';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable, of, ReplaySubject } from 'rxjs';

import { routerActions } from '~app/core/router/router.actions';
import { mockUser } from '~tests/mocks/user';

import { authActions } from './auth.actions';
import { AuthEffects } from './auth.effets';
import { authFeature } from './auth.feature';
import { AuthService } from './auth.service';
import { User } from './user.model';

describe('Auth Effects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  let store: MockStore;

  const authService = {
    signInWithGoogle: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    user$: new ReplaySubject<User | null>(0),
    error$: new ReplaySubject<AuthError | null>(0),
  };

  beforeEach(async () => {
    await MockBuilder(AuthEffects)
      .provide(provideMockActions(() => actions$))
      .provide(provideMockStore({ selectors: [{ selector: authFeature.selectRedirectUrl, value: '/' }] }))
      .provide({ provide: AuthService, useValue: authService });

    effects = ngMocks.findInstance(AuthEffects);
    store = ngMocks.findInstance(MockStore);
  });

  describe('login$', () => {
    it('should dispatch success when signInWithGoogle successfull', () => {
      authService.signInWithGoogle.mockReturnValue(of({}));

      actions$ = hot('-a-', { a: authActions.googleLogin() });
      const expected = cold('-a-', { a: authActions.loginSuccess() });

      expect(effects.login$).toBeObservable(expected);
      expect(authService.signInWithGoogle).toHaveBeenCalled();
    });

    it('should dispatch AuthError when signInWithGoogle error', () => {
      authService.signInWithGoogle.mockReturnValue(cold('#', undefined, { msg: 'error' }));

      actions$ = hot('-a-', { a: authActions.googleLogin() });
      const expected = cold('-b-', {
        b: authActions.error({ error: 'error' }),
      });

      expect(effects.login$).toBeObservable(expected);
      expect(authService.signInWithGoogle).toHaveBeenCalled();
    });
  });

  describe('emailPasswordLogin$', () => {
    it('should dispatch success when sign with email and password not return an error', () => {
      authService.signInWithEmailAndPassword.mockReturnValue(of({}));
      actions$ = hot('-a-', {
        a: authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }),
      });
      const expected = cold('-a-', { a: authActions.loginSuccess() });
      expect(effects.devLogin$).toBeObservable(expected);
      expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.fr', '123456');
    });

    it('should dispatch AuthError when sign with email and password rise an error', () => {
      authService.signInWithEmailAndPassword.mockReturnValue(cold('#'));
      actions$ = hot('-a-', {
        a: authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }),
      });
      const expected = cold('-b-', {
        b: authActions.error({}),
      });
      expect(effects.devLogin$).toBeObservable(expected);
      expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.fr', '123456');
    });

    it('should dispatch AuthError when sign with email and password return an error', () => {
      authService.signInWithEmailAndPassword.mockReturnValue(of({ error: { message: 'error' } }));
      actions$ = hot('-a-', {
        a: authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }),
      });
      const expected = cold('-b-', {
        b: authActions.error({ error: 'error' }),
      });
      expect(effects.devLogin$).toBeObservable(expected);
      expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.fr', '123456');
    });
  });

  describe('findUserWhenLoginSuccess$', () => {
    it('should find user when login success', () => {
      actions$ = hot('-a-', { a: authActions.loginSuccess() });
      const expected = cold('-a-', { a: authActions.findUser() });

      expect(effects.findUserWhenLoginSuccess$).toBeObservable(expected);
    });
  });

  describe('redirectWhenLoginSuccess$', () => {
    it('should redirect when login success', () => {
      actions$ = hot('-a-', { a: authActions.loginSuccess() });
      const expected = cold('-a-', { a: authActions.redirect() });

      expect(effects.redirectWhenLoginSuccess$).toBeObservable(expected);
    });
  });

  describe('getUser$', () => {
    it('should dispatch Authenticated when user is connected', () => {
      authService.user$.next(mockUser);

      actions$ = hot('-a-', { a: authActions.findUser() });
      const expected = cold('-b-', {
        b: authActions.findUserSuccess({ user: mockUser }),
      });

      expect(effects.getUser$).toBeObservable(expected);
    });

    it('should dispatch NotAuthenticated when user is disconnected', () => {
      authService.user$.next(null);

      actions$ = hot('-a-', { a: authActions.findUser() });
      const expected = cold('-b-', { b: authActions.notAuthenticated({}) });

      expect(effects.getUser$).toBeObservable(expected);
    });
  });

  describe('logout$', () => {
    it('should dispatch a NotAuthenticated when signOut successfull', () => {
      authService.signOut.mockReturnValue(of(undefined));

      actions$ = hot('-a-', { a: authActions.logout() });
      const expected = cold('-b-', { b: authActions.notAuthenticated({}) });

      expect(effects.logout$).toBeObservable(expected);
      expect(authService.signOut).toHaveBeenCalled();
    });

    it('should dispatch a AuthError when signOut error', () => {
      authService.signOut.mockReturnValue(cold('#'));

      actions$ = hot('-a-', { a: authActions.logout() });
      const expected = cold('-b-', {
        b: authActions.error({}),
      });

      expect(effects.logout$).toBeObservable(expected);
      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  describe('watchError$', () => {
    it('should watch auth service errors', () => {
      authService.error$.next({ message: 'error' } as unknown as AuthError);

      actions$ = hot('-a-', { a: authActions.findUser() });
      const expected = cold('-b-', { b: authActions.error({ error: 'error' }) });

      expect(effects.watchError$).toBeObservable(expected);
    });
  });

  describe('accessDenied$', () => {
    it(`should navigate when AuthError with 'auth/user-disabled' code is dispatched`, () => {
      actions$ = hot('-a-', { a: authActions.error({ error: 'invalid claim: missing sub claim' }) });
      const expected = cold('-b-', { b: routerActions.navigate({ commands: ['/access-denied'] }) });

      expect(effects.accessDenied$).toBeObservable(expected);
    });
  });

  describe('goToLogin$', () => {
    it('should navigate when NotAuthenticated is dispatched', () => {
      actions$ = hot('-a-', { a: authActions.notAuthenticated({}) });
      const expected = cold('-b-', { b: routerActions.navigate({ commands: ['/login'] }) });

      expect(effects.goToLogin$).toBeObservable(expected);
    });
  });

  describe('redirect$', () => {
    it('should redirect to / when Redirect is dispatched', () => {
      actions$ = hot('-a-', { a: authActions.redirect() });
      const expected = cold('-b-', { b: routerActions.navigate({ commands: ['/'] }) });

      expect(effects.redirect$).toBeObservable(expected);
    });

    it('should redirect to url when Redirect is dispatched', () => {
      authFeature.selectRedirectUrl.setResult('/redirect');
      store.refreshState();

      actions$ = hot('-a-', { a: authActions.redirect() });
      const expected = cold('-b-', { b: routerActions.navigate({ commands: ['/redirect'] }) });

      expect(effects.redirect$).toBeObservable(expected);
    });
  });
});
