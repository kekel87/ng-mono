import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { SaveState } from '~shared/enums/save-state';
import { Item } from '~shared/models/item';
import { SupabaseService } from '~shared/services/supabase.service';
import { MockCollection } from '~tests/mocks/collection';

import { collectionDetailActions } from './core/store/detail.actions';
import { detailResolver } from './detail.resolver';
import { State } from '../core/entities/collections.feature';
import * as collectionsSelectors from '../core/entities/collections.selectors';
import * as initUtils from '../share/utils/init-collections.utils';

describe('detail.resolver.spec.ts', () => {
  let store: MockStore;
  const routerStateSnapshot = {} as RouterStateSnapshot;
  const supabaseService = {
    findById: jest.fn(),
  };

  const getMockRoute = (id: string, collection: Collection): ActivatedRouteSnapshot => {
    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue(id);
    activatedRouteSnapshot.data = { collection };
    return activatedRouteSnapshot;
  };

  const selectLinkStateSpy = jest.fn();
  const selectLinkStateFactorySpy = jest
    .spyOn(collectionsSelectors, 'selectLinkStateFactory')
    .mockReturnValue(selectLinkStateSpy as unknown as MemoizedSelector<Record<string, unknown>, LinkState, (s1: State) => LinkState>);

  const selectEntitySpy = jest.fn();
  const selectEntityFactorySpy = jest
    .spyOn(collectionsSelectors, 'selectEntityFactory')
    .mockReturnValue(
      selectEntitySpy as unknown as MemoizedSelector<Record<string, unknown>, Item | undefined, (s1: State) => Item | undefined>
    );

  const initCollectionsSpy = jest.spyOn(initUtils, 'initCollections').mockImplementation();

  beforeEach(async () => {
    await MockBuilder().provide(provideMockStore()).mock(SupabaseService, supabaseService);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    supabaseService.findById.mockReset();
    selectLinkStateFactorySpy.mockClear();
    selectEntityFactorySpy.mockClear();
  });

  it('should resolve new item', () => {
    const expected = cold('(a|)', {
      a: { item: MockCollection.newGame, collection: Collection.Games },
    });

    expect(TestBed.runInInjectionContext(() => detailResolver(getMockRoute('new', Collection.Games), routerStateSnapshot))).toBeObservable(
      expected
    );
    expect(store.dispatch).toHaveBeenCalledWith(collectionDetailActions.setSaveState({ saveState: SaveState.NotSave }));

    expect(supabaseService.findById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Games }));
    expect(initCollectionsSpy).not.toHaveBeenCalledWith(store, [Collection.Games]);
  });

  it('should resolve from linked Collection', () => {
    selectLinkStateSpy.mockReturnValue(LinkState.Linked);
    selectEntitySpy.mockReturnValue(MockCollection.itemNotAcquired);

    const expected = cold('(a|)', {
      a: { item: MockCollection.itemNotAcquired, collection: Collection.Amiibos },
    });
    expect(
      TestBed.runInInjectionContext(() => detailResolver(getMockRoute('uid2', Collection.Amiibos), routerStateSnapshot))
    ).toBeObservable(expected);
    expect(selectLinkStateFactorySpy).toHaveBeenCalledWith(Collection.Amiibos);
    expect(selectEntityFactorySpy).toHaveBeenCalledWith(Collection.Amiibos, 'uid2');

    expect(supabaseService.findById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Amiibos }));
  });

  it('should resolve from online data', () => {
    selectLinkStateSpy.mockReturnValue(LinkState.Loading);
    supabaseService.findById.mockReturnValue(of(MockCollection.itemNotAcquired));

    const expected = cold('(a|)', {
      a: { item: MockCollection.itemNotAcquired, collection: Collection.Games },
    });
    expect(TestBed.runInInjectionContext(() => detailResolver(getMockRoute('uid2', Collection.Games), routerStateSnapshot))).toBeObservable(
      expected
    );
    expect(supabaseService.findById).toHaveBeenCalledWith(Collection.Games, 'uid2');
    expect(selectLinkStateFactorySpy).toHaveBeenCalledWith(Collection.Games);

    expect(selectEntityFactorySpy).not.toHaveBeenCalledWith(Collection.Games, 'uid2');
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Games }));
  });

  it('should dispatch NotFound', () => {
    selectLinkStateSpy.mockReturnValue(LinkState.Linked);
    selectEntitySpy.mockReturnValue(undefined);
    supabaseService.findById.mockReturnValue(of(undefined));

    const expected = cold('#', undefined, 'Item not found');
    expect(TestBed.runInInjectionContext(() => detailResolver(getMockRoute('uid3', Collection.Books), routerStateSnapshot))).toBeObservable(
      expected
    );
    expect(selectLinkStateFactorySpy).toHaveBeenCalledWith(Collection.Books);
    expect(selectEntityFactorySpy).toHaveBeenCalledWith(Collection.Books, 'uid3');
    expect(supabaseService.findById).toHaveBeenCalledWith(Collection.Books, 'uid3');
    expect(store.dispatch).toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Books }));
  });
});
