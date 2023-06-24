import { ActivatedRouteSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';

import { ListResolver } from './list.resolver';
import { collectionsActions } from '../core/entities/collections.actions';

describe('ListResolver', () => {
  let resolver: ListResolver;
  let store: MockStore;

  const getMockRoute = (collection: Collection): ActivatedRouteSnapshot => {
    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue(collection);
    return activatedRouteSnapshot;
  };

  beforeEach(async () => {
    await MockBuilder(ListResolver).provide(provideMockStore({ initialState: { collection: { collections: {} } } }));

    resolver = ngMocks.findInstance(ListResolver);
    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  it('should init simple collection and wait for her initialise', () => {
    store.setState({ collection: { collections: { [Collection.Amiibos]: { linkState: LinkState.Loading } } } });
    const expected = cold('------');
    expect(resolver.resolve(getMockRoute(Collection.Amiibos))).toBeObservable(expected);
    expect(store.dispatch).toHaveBeenCalledWith(collectionsActions.init({ collection: Collection.Amiibos }));
  });

  it('should resolve a simple collection without re-init them', () => {
    // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
    store.setState({ collection: { collections: { [Collection.Amiibos]: { linkState: LinkState.Linked } } } });

    const expected = cold('(a|)', {
      a: Collection.Amiibos,
    });
    expect(resolver.resolve(getMockRoute(Collection.Amiibos))).toBeObservable(expected);
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionsActions.init({ collection: Collection.Amiibos }));
  });

  it('should init collection with relations and wait for her initialise', () => {
    store.setState({
      collection: {
        collections: {
          [Collection.Games]: { linkState: LinkState.Loading },
          [Collection.Consoles]: { linkState: LinkState.Loading },
        },
      },
    });
    const expected = cold('------');
    expect(resolver.resolve(getMockRoute(Collection.Games))).toBeObservable(expected);
    expect(store.dispatch).toHaveBeenCalledWith(collectionsActions.init({ collection: Collection.Games }));
    expect(store.dispatch).toHaveBeenCalledWith(collectionsActions.init({ collection: Collection.Consoles }));
  });

  it('should wait all relations before resolve', () => {
    store.setState({
      collection: {
        collections: {
          [Collection.Games]: { linkState: LinkState.Linked },
          [Collection.Consoles]: { linkState: LinkState.Loading },
        },
      },
    });

    const expected = cold('------');
    expect(resolver.resolve(getMockRoute(Collection.Games))).toBeObservable(expected);
  });

  it('should resolve collection with relations without re-init them', () => {
    store.setState({
      collection: {
        collections: {
          [Collection.Games]: { linkState: LinkState.Linked },
          [Collection.Consoles]: { linkState: LinkState.Linked },
        },
      },
    });

    const expected = cold('(a|)', {
      a: Collection.Games,
    });
    expect(resolver.resolve(getMockRoute(Collection.Games))).toBeObservable(expected);
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionsActions.init({ collection: Collection.Games }));
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionsActions.init({ collection: Collection.Consoles }));
  });
});
