import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';

import { listResolver } from './list.resolver';
import { State } from '../core/entities/collections.feature';
import * as collectionsSelectors from '../core/entities/collections.selectors';
import * as initUtils from '../share/utils/init-collections.utils';

describe('listResolver', () => {
  let store: MockStore;
  const routerStateSnapshot = {} as RouterStateSnapshot;

  const getMockRoute = (collection: Collection): ActivatedRouteSnapshot => {
    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue(collection);
    return activatedRouteSnapshot;
  };

  const selectLinkStateSpy = jest.fn();
  const selectLinkStateFactorySpy = jest
    .spyOn(collectionsSelectors, 'selectLinkStateFactory')
    .mockReturnValue(selectLinkStateSpy as unknown as MemoizedSelector<Record<string, unknown>, LinkState, (s1: State) => LinkState>);

  const initCollectionsSpy = jest.spyOn(initUtils, 'initCollections').mockImplementation();

  beforeEach(async () => {
    await MockBuilder().provide(provideMockStore());

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  it('should wait for collection initialise', () => {
    selectLinkStateSpy.mockReturnValue(LinkState.Loading);

    expect(TestBed.runInInjectionContext(() => listResolver(getMockRoute(Collection.Amiibos), routerStateSnapshot))).toBeObservable(
      cold('------')
    );
    expect(initCollectionsSpy).toHaveBeenCalledWith(store, [Collection.Amiibos]);
    expect(selectLinkStateFactorySpy).toHaveBeenCalledWith(Collection.Amiibos);
  });

  it('should resolve a simple collection', () => {
    selectLinkStateSpy.mockReturnValue(LinkState.Linked);

    expect(TestBed.runInInjectionContext(() => listResolver(getMockRoute(Collection.Amiibos), routerStateSnapshot))).toBeObservable(
      cold('(a|)', { a: Collection.Amiibos })
    );
  });

  it('should wait for collection with relations initialise', () => {
    selectLinkStateSpy.mockReturnValueOnce(LinkState.Loading).mockReturnValueOnce(LinkState.Loading);

    expect(TestBed.runInInjectionContext(() => listResolver(getMockRoute(Collection.Games), routerStateSnapshot))).toBeObservable(
      cold('------')
    );
    expect(selectLinkStateFactorySpy).toHaveBeenCalledWith(Collection.Games);
    expect(selectLinkStateFactorySpy).toHaveBeenCalledWith(Collection.Games);
  });

  it('should wait all relations before resolve', () => {
    selectLinkStateSpy.mockReturnValueOnce(LinkState.Linked).mockReturnValueOnce(LinkState.Loading);

    expect(TestBed.runInInjectionContext(() => listResolver(getMockRoute(Collection.Games), routerStateSnapshot))).toBeObservable(
      cold('------')
    );
  });

  it('should resolve collection with relations', () => {
    selectLinkStateSpy.mockReturnValueOnce(LinkState.Linked).mockReturnValueOnce(LinkState.Linked);

    expect(TestBed.runInInjectionContext(() => listResolver(getMockRoute(Collection.Games), routerStateSnapshot))).toBeObservable(
      cold('(a|)', { a: Collection.Games })
    );
  });
});
