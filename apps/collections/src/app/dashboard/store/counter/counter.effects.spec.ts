import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable, of } from 'rxjs';

import { routerActions } from '~app/core/router/router.actions';
import { LinkState } from '~shared/enums/link-state';
import { FirestoreService } from '~shared/services/firestore.service';
import { MockFirebaseError } from '~tests/mocks/mock-firebase-error';

import { counterActions } from './counter.actions';
import { CounterEffects } from './counter.effects';
import { counterFeature } from './counter.feature';
import { Counter } from './counter.model';

describe('CounterEffects', () => {
  let actions$: Observable<Action>;
  let effects: CounterEffects;
  let store: MockStore;

  const firestoreService = {
    onChange: jest.fn(),
  };

  const counters: Counter[] = [
    { count: 26, id: 'consoles' },
    { count: 166, id: 'games' },
    { count: 3, id: 'users' },
  ];

  beforeEach(async () => {
    await MockBuilder(CounterEffects)
      .provide(provideMockActions(() => actions$))
      .provide(provideMockStore({ selectors: [{ selector: counterFeature.selectCollectionState, value: LinkState.Initial }] }))
      .provide({ provide: FirestoreService, useValue: firestoreService });

    effects = ngMocks.findInstance(CounterEffects);
    store = ngMocks.findInstance(MockStore);
  });

  it('should initialize counter when navigate on dashboard', () => {
    expect(effects.ngrxOnInitEffects()).toEqual(counterActions.init());
  });

  describe('dataChange$', () => {
    it('should init data change for counter collection', () => {
      firestoreService.onChange.mockReturnValue(of(counters));

      actions$ = hot('-a-', { a: counterActions.init() });
      const expected = cold('-a-', { a: counterActions.dataChange({ counters }) });

      expect(effects.initDataChange$).toBeObservable(expected);
    });

    it('should handle error', () => {
      firestoreService.onChange.mockReturnValue(cold('#', undefined, MockFirebaseError.base));

      actions$ = hot('-a-', { a: counterActions.init() });
      const expected = cold('-a-', { a: counterActions.error({ error: MockFirebaseError.base.code }) });

      expect(effects.initDataChange$).toBeObservable(expected);
    });
  });

  describe('initSuccesWhenDataChangeAndNotLinked$', () => {
    it('should init success', () => {
      actions$ = hot('-a-', { a: counterActions.dataChange({ counters }) });
      const expected = cold('-a-', { a: counterActions.initSuccess() });

      expect(effects.initSuccesWhenDataChangeAndNotLinked$).toBeObservable(expected);
    });

    it('should not emit if counter collection already init', () => {
      counterFeature.selectCollectionState.setResult(LinkState.Linked);
      store.refreshState();

      actions$ = hot('-a-', { a: counterActions.dataChange({ counters }) });
      const expected = cold('---');
      expect(effects.initSuccesWhenDataChangeAndNotLinked$).toBeObservable(expected);
    });
  });

  describe('permissionDenied$', () => {
    it('should show access-denied error page', () => {
      actions$ = hot('-a-', {
        a: counterActions.error({ error: 'permission-denied' }),
      });
      const expected = cold('-b-', {
        b: routerActions.navigate({ commands: ['/access-denied'] }),
      });

      expect(effects.permissionDenied$).toBeObservable(expected);
    });
  });
});
