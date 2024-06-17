import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthError } from '@supabase/supabase-js';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable, of, ReplaySubject } from 'rxjs';

import { routerActions } from '@ng-mono/shared/utils';

import { authActions } from './auth.actions';
import { AuthEffects } from './auth.effets';
import { authFeature } from './auth.feature';
import { mockUser } from '../../../../testing/mocks/user';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

describe('Auth Effects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  let store: MockStore;

  const authService = {
    init: jest.fn(),
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

  describe('init$', () => {
    it('should init auth and set user when is connected', () => {
      authService.user$.next(mockUser);

      actions$ = hot('-a-', { a: authActions.init() });

      expect(effects.init$).toBeObservable(cold('-a-', { a: authActions.setUser({ user: mockUser }) }));
      expect(authService.init).toHaveBeenCalled();
    });

    it('should init auth and NotAuthenticated when user is disconnected', () => {
      authService.user$.next(null);

      actions$ = hot('-a-', { a: authActions.init() });

      expect(effects.init$).toBeObservable(cold('-b-', { b: authActions.notAuthenticated({}) }));
      expect(authService.init).toHaveBeenCalled();
    });
  });

  describe('googleLogin$', () => {
    it('should dispatch success when signInWithGoogle successfully', () => {
      authService.signInWithGoogle.mockReturnValue(of({}));

      actions$ = hot('-a-', { a: authActions.googleLogin() });

      expect(effects.googleLogin$).toBeObservable(cold('-a-', { a: authActions.loginSuccess() }));
      expect(authService.signInWithGoogle).toHaveBeenCalled();
    });

    it('should dispatch AuthError when signInWithGoogle error', () => {
      authService.signInWithGoogle.mockReturnValue(cold('#', undefined, { msg: 'error' }));

      actions$ = hot('-a-', { a: authActions.googleLogin() });

      expect(effects.googleLogin$).toBeObservable(cold('-a-', { a: authActions.setError({ error: 'error' }) }));
      expect(authService.signInWithGoogle).toHaveBeenCalled();
    });
  });

  describe('emailPasswordLogin$', () => {
    it('should dispatch success when sign with email and password not return an error', () => {
      authService.signInWithEmailAndPassword.mockReturnValue(of({}));

      actions$ = hot('-a-', {
        a: authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }),
      });

      expect(effects.emailPasswordLogin$).toBeObservable(cold('-a-', { a: authActions.loginSuccess() }));
      expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.fr', '123456');
    });

    it('should dispatch AuthError when sign with email and password rise an error', () => {
      authService.signInWithEmailAndPassword.mockReturnValue(cold('#'));

      actions$ = hot('-a-', {
        a: authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }),
      });

      expect(effects.emailPasswordLogin$).toBeObservable(cold('-a-', { a: authActions.setError({}) }));
      expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.fr', '123456');
    });

    it('should dispatch AuthError when sign with email and password return an error', () => {
      authService.signInWithEmailAndPassword.mockReturnValue(of({ error: { message: 'error' } }));

      actions$ = hot('-a-', {
        a: authActions.emailPasswordLogin({ email: 'test@test.fr', password: '123456' }),
      });

      expect(effects.emailPasswordLogin$).toBeObservable(cold('-a-', { a: authActions.setError({ error: 'error' }) }));
      expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.fr', '123456');
    });
  });

  describe('redirectWhenLoginSuccess$', () => {
    it('should redirect when login success', () => {
      actions$ = hot('-a-', { a: authActions.loginSuccess() });

      expect(effects.redirectOnLoginSuccess$).toBeObservable(cold('-a-', { a: authActions.redirect() }));
    });
  });

  describe('logout$', () => {
    it('should dispatch a NotAuthenticated when signOut successfully', () => {
      authService.signOut.mockReturnValue(of(undefined));

      actions$ = hot('-a-', { a: authActions.logout() });

      expect(effects.logout$).toBeObservable(cold('-a-', { a: authActions.notAuthenticated({}) }));
      expect(authService.signOut).toHaveBeenCalled();
    });

    it('should dispatch a AuthError when signOut error', () => {
      authService.signOut.mockReturnValue(cold('#'));

      actions$ = hot('-a-', { a: authActions.logout() });

      expect(effects.logout$).toBeObservable(cold('-a-', { a: authActions.setError({}) }));
      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  describe('goToLogin$', () => {
    it('should navigate when NotAuthenticated is dispatched', () => {
      actions$ = hot('-a-', { a: authActions.notAuthenticated({}) });

      expect(effects.goToLogin$).toBeObservable(cold('-a-', { a: routerActions.navigate({ commands: ['/login'] }) }));
    });
  });

  describe('redirect$', () => {
    it('should redirect to / when Redirect is dispatched', () => {
      actions$ = hot('-a-', { a: authActions.redirect() });

      expect(effects.redirect$).toBeObservable(cold('-a-', { a: routerActions.navigate({ commands: ['/'] }) }));
    });

    it('should redirect to url when Redirect is dispatched', () => {
      authFeature.selectRedirectUrl.setResult('/redirect');
      store.refreshState();

      actions$ = hot('-a-', { a: authActions.redirect() });

      expect(effects.redirect$).toBeObservable(cold('-a-', { a: routerActions.navigate({ commands: ['/redirect'] }) }));
    });
  });
});
