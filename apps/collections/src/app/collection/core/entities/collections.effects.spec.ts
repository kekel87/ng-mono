import { provideMockActions } from '@ngrx/effects/testing';
import { Action, MemoizedSelector } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable, of, throwError } from 'rxjs';

import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { SupabaseService } from '~shared/services/supabase.service';
import { MockCollection } from '~tests/mocks/collection';

import { collectionsActions } from './collections.actions';
import { CollectionsEffects } from './collections.effects';
import { State } from './collections.feature';
import * as collectionsSelectors from './collections.selectors';

describe('CollectionsEffects', () => {
  let actions$: Observable<Action>;
  let effects: CollectionsEffects;

  const supabaseService = {
    onChange: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    await MockBuilder(CollectionsEffects)
      .provide(provideMockActions(() => actions$))
      .provide(provideMockStore())
      .mock(SupabaseService, supabaseService);

    effects = ngMocks.findInstance(CollectionsEffects);
  });

  describe('initDataChange$', () => {
    it('should init data change for item list', () => {
      supabaseService.onChange.mockReturnValue(of(MockCollection.items));

      actions$ = hot('-a-', { a: collectionsActions.init({ collection: Collection.Games }) });
      const expected = cold('-a-', {
        a: collectionsActions.dataChange({ collection: Collection.Games, items: MockCollection.items }),
      });

      expect(effects.initDataChange$).toBeObservable(expected);
    });

    it('should handle error', () => {
      supabaseService.onChange.mockReturnValue(cold('#'));

      actions$ = hot('-a-', { a: collectionsActions.init({ collection: Collection.Amiibos }) });
      const expected = cold('-a-', {
        a: collectionsActions.error({ collection: Collection.Amiibos }),
      });

      expect(effects.initDataChange$).toBeObservable(expected);
    });
  });

  describe('initSuccesWhenDataChangeAndNotLinked$', () => {
    const selectorSpy = jest.fn();
    const selectorFactorySpy = jest
      .spyOn(collectionsSelectors, 'selectLinkStateFactory')
      .mockReturnValue(selectorSpy as unknown as MemoizedSelector<Record<string, unknown>, LinkState, (s1: State) => LinkState>);

    it('should init item list', () => {
      selectorSpy.mockReturnValue(LinkState.Loading);

      actions$ = hot('-a-', { a: collectionsActions.dataChange({ collection: Collection.Games, items: MockCollection.items }) });
      const expected = cold('-a-', { a: collectionsActions.initSuccess({ collection: Collection.Games }) });

      expect(effects.initSuccesWhenDataChangeAndNotLinked$).toBeObservable(expected);
      expect(selectorFactorySpy).toHaveBeenCalledWith(Collection.Games);
    });

    it('should only emit if item list is not already init', () => {
      selectorSpy.mockReturnValue(LinkState.Linked);

      actions$ = hot('-a-', { a: collectionsActions.dataChange({ collection: Collection.Games, items: MockCollection.items }) });
      const expected = cold('---');

      expect(effects.initSuccesWhenDataChangeAndNotLinked$).toBeObservable(expected);
      expect(selectorFactorySpy).toHaveBeenCalledWith(Collection.Games);
    });
  });

  describe('save$', () => {
    it('should save an item', () => {
      supabaseService.save.mockReturnValue(cold('a|'));

      actions$ = hot('-a-', {
        a: collectionsActions.save({ collection: Collection.Books, item: MockCollection.items[0] }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.saveSuccess({ collection: Collection.Books }),
      });

      expect(effects.save$).toBeObservable(expected);
    });

    it('should handle error', () => {
      supabaseService.save.mockReturnValue(throwError('error'));
      actions$ = hot('-a-', {
        a: collectionsActions.save({
          collection: Collection.Vinyles,
          item: MockCollection.items[0],
        }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.error({ collection: Collection.Vinyles }),
      });
      expect(effects.save$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    it('should delete a item', () => {
      supabaseService.delete.mockReturnValue(cold('a|'));

      actions$ = hot('-a-', {
        a: collectionsActions.delete({ collection: Collection.Vinyles, id: 'uid1' }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.deleteSuccess({ collection: Collection.Vinyles }),
      });

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should handle error', () => {
      supabaseService.delete.mockReturnValue(throwError('error'));

      actions$ = hot('-a--', {
        a: collectionsActions.delete({ collection: Collection.Vinyles, id: 'uid1' }),
      });
      const expected = cold('-b-', {
        b: collectionsActions.error({ collection: Collection.Vinyles }),
      });

      expect(effects.delete$).toBeObservable(expected);
    });
  });
});
