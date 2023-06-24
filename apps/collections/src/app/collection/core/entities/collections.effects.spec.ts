import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable, of, throwError } from 'rxjs';

import { routerActions } from '~app/core/router/router.actions';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { FirestoreService } from '~shared/services/firestore.service';
import { MockCollection } from '~tests/mocks/collection';
import { MockFirebaseError } from '~tests/mocks/mock-firebase-error';

import { collectionsActions } from './collections.actions';
import { CollectionsEffects } from './collections.effects';

describe('CollectionsEffects', () => {
  let actions$: Observable<Action>;
  let effects: CollectionsEffects;
  let store: MockStore;

  const firestoreService = {
    onChange: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    await MockBuilder(CollectionsEffects)
      .provide(provideMockActions(() => actions$))
      .provide(provideMockStore())
      .provide({ provide: FirestoreService, useValue: firestoreService });

    effects = ngMocks.findInstance(CollectionsEffects);
    store = ngMocks.findInstance(MockStore);
  });

  describe('initDataChange$', () => {
    it('should init data change for item list', () => {
      firestoreService.onChange.mockReturnValue(of(MockCollection.items));

      actions$ = hot('-a-', { a: collectionsActions.init({ collection: Collection.Games }) });
      const expected = cold('-a-', {
        a: collectionsActions.dataChange({ collection: Collection.Games, items: MockCollection.items }),
      });

      expect(effects.initDataChange$).toBeObservable(expected);
    });

    it('should handle error', () => {
      firestoreService.onChange.mockReturnValue(cold('#', undefined, MockFirebaseError.base));

      actions$ = hot('-a-', { a: collectionsActions.init({ collection: Collection.Amiibos }) });
      const expected = cold('-a-', {
        a: collectionsActions.error({ collection: Collection.Amiibos, error: MockFirebaseError.base.code }),
      });

      expect(effects.initDataChange$).toBeObservable(expected);
    });
  });

  describe('initSuccesWhenDataChangeAndNotLinked$', () => {
    it('should init item list', () => {
      // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
      store.setState({
        collection: {
          collections: {
            [Collection.Games]: {
              linkState: LinkState.Loading,
            },
          },
        },
      });

      actions$ = hot('-a-', { a: collectionsActions.dataChange({ collection: Collection.Games, items: MockCollection.items }) });
      const expected = cold('-a-', { a: collectionsActions.initSuccess({ collection: Collection.Games }) });

      expect(effects.initSuccesWhenDataChangeAndNotLinked$).toBeObservable(expected);
    });

    it('should only emit if item list already init', () => {
      // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
      store.setState({
        collection: {
          collections: {
            [Collection.Games]: {
              linkState: LinkState.Linked,
            },
          },
        },
      });

      actions$ = hot('-a-', { a: collectionsActions.dataChange({ collection: Collection.Games, items: MockCollection.items }) });
      const expected = cold('---');

      expect(effects.initSuccesWhenDataChangeAndNotLinked$).toBeObservable(expected);
    });
  });

  describe('save$', () => {
    it('should save an item', () => {
      firestoreService.save.mockReturnValue(cold('a|'));

      actions$ = hot('-a-', {
        a: collectionsActions.save({ collection: Collection.Books, item: MockCollection.items[0] }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.saveSuccess({ collection: Collection.Books }),
      });

      expect(effects.save$).toBeObservable(expected);
    });

    it('should handle error', () => {
      firestoreService.save.mockReturnValue(throwError(MockFirebaseError.base));
      actions$ = hot('-a-', {
        a: collectionsActions.save({
          collection: Collection.Vinyles,
          item: MockCollection.items[0],
        }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.error({ collection: Collection.Vinyles, error: MockFirebaseError.base.code }),
      });
      expect(effects.save$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    it('should delete a item', () => {
      firestoreService.delete.mockReturnValue(cold('a|'));

      actions$ = hot('-a-', {
        a: collectionsActions.delete({ collection: Collection.Vinyles, id: 'uid1' }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.deleteSuccess({ collection: Collection.Vinyles }),
      });

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should handle error', () => {
      firestoreService.delete.mockReturnValue(throwError(MockFirebaseError.base));

      actions$ = hot('-a--', {
        a: collectionsActions.delete({ collection: Collection.Vinyles, id: 'uid1' }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.error({ collection: Collection.Vinyles, error: MockFirebaseError.base.code }),
      });

      expect(effects.delete$).toBeObservable(expected);
    });
  });

  describe('permissionDenied$', () => {
    it('should show access-denied error page', () => {
      actions$ = hot('-a-', {
        a: collectionsActions.error({
          collection: Collection.Vinyles,
          error: 'permission-denied',
        }),
      });
      const expected = cold('-b-', {
        b: routerActions.navigate({ commands: ['/access-denied'] }),
      });

      expect(effects.permissionDenied$).toBeObservable(expected);
    });
  });
});
