import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable } from 'rxjs';

import { routerActions } from './router.actions';
import { RouterEffects } from './router.effects';

describe('RouterEffects', () => {
  let effects: RouterEffects;
  let actions$: Observable<Action>;
  let router: Router;
  let ngZone: NgZone;

  beforeEach(async () => {
    await MockBuilder(RouterEffects)
      .keep(RouterTestingModule.withRoutes([]))
      .provide(provideMockActions(() => actions$));

    effects = ngMocks.findInstance(RouterEffects);
    router = ngMocks.findInstance(Router);
    ngZone = ngMocks.findInstance(NgZone);
  });

  describe('navigate$', () => {
    it('should navigate', () => {
      jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
      jest.spyOn(ngZone, 'run').mockImplementation(<T>(fn: () => T) => fn());

      actions$ = hot('-a-', { a: routerActions.navigate({ commands: ['/home'] }) });
      expect(effects.navigate$).toBeObservable(cold('---'));
      expect(router.navigate).toHaveBeenCalledWith(['/home'], undefined);
    });
  });
});
