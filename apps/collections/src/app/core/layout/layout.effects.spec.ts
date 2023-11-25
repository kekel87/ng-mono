import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable } from 'rxjs';

import { layoutActions } from './layout.actions';
import { LayoutEffects } from './layout.effects';
import { layoutFeature } from './layout.feature';

describe('LayoutEffetcs', () => {
  let actions$: Observable<Action>;
  let effects: LayoutEffects;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(LayoutEffects)
      .provide(provideMockActions(() => actions$))
      .provide(provideMockStore({ selectors: [{ selector: layoutFeature.selectShowSearchBar, value: false }] }));

    effects = ngMocks.findInstance(LayoutEffects);
    store = ngMocks.findInstance(MockStore);
  });

  describe('resetToolbar$', () => {
    it('should reset config after navigation', () => {
      actions$ = hot('-a-', { a: { type: ROUTER_NAVIGATION } });
      const expected = cold('-a-', { a: layoutActions.resetToolbar() });
      expect(effects.resetToolbar$).toBeObservable(expected);
    });
  });

  describe('closeSearchBar$', () => {
    it('should close search-bar on navigate', () => {
      layoutFeature.selectShowSearchBar.setResult(true);
      store.refreshState();

      actions$ = hot('-a-', { a: { type: ROUTER_NAVIGATED } });
      const expected = cold('-a-', { a: layoutActions.closeSearchBar() });
      expect(effects.closeSearchBar$).toBeObservable(expected);
    });
  });
});
