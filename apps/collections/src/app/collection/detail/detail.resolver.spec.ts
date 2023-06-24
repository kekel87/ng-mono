import { ActivatedRouteSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { FirestoreService } from '~shared/services/firestore.service';
import { MockCollection } from '~tests/mocks/collection';

import { collectionDetailActions } from './core/store/detail.actions';
import { DetailResolver } from './detail.resolver';

describe('DetailResolver', () => {
  let resolver: DetailResolver;
  let store: MockStore;
  const firestoreService = {
    findById: jest.fn(),
    createId: jest.fn(),
  };

  const getMockRoute = (id: string, collection: Collection): ActivatedRouteSnapshot => {
    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue(id);
    activatedRouteSnapshot.data = { collection };
    return activatedRouteSnapshot;
  };

  beforeEach(async () => {
    await MockBuilder(DetailResolver)
      .provide(provideMockStore({ initialState: { collection: { collections: {} } } }))
      .provide({ provide: FirestoreService, useValue: firestoreService });

    resolver = ngMocks.findInstance(DetailResolver);
    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    firestoreService.createId.mockReset();
    firestoreService.findById.mockReset();
    firestoreService.createId.mockReturnValue('newId');
  });

  it('should resolve new Game', () => {
    const expected = cold('(a|)', {
      a: { item: MockCollection.newGame, collection: Collection.Games },
    });
    expect(resolver.resolve(getMockRoute('new', Collection.Games))).toBeObservable(expected);
    expect(firestoreService.findById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Games }));
  });

  it('should resolve new Amiibo', () => {
    const expected = cold('(a|)', {
      a: { item: MockCollection.newAmiibos, collection: Collection.Amiibos },
    });
    expect(resolver.resolve(getMockRoute('new', Collection.Amiibos))).toBeObservable(expected);
    expect(firestoreService.findById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Amiibos }));
  });

  it('should resolve new Vinyle', () => {
    const expected = cold('(a|)', {
      a: { item: MockCollection.newVinyle, collection: Collection.Vinyles },
    });
    expect(resolver.resolve(getMockRoute('new', Collection.Vinyles))).toBeObservable(expected);
    expect(firestoreService.findById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Vinyles }));
  });

  it('should resolve new Book', () => {
    const expected = cold('(a|)', {
      a: { item: MockCollection.newBook, collection: Collection.Books },
    });
    expect(resolver.resolve(getMockRoute('new', Collection.Books))).toBeObservable(expected);
    expect(firestoreService.findById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Books }));
  });

  it('should resolve from linked Collection', () => {
    // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
    store.setState({
      collection: {
        collections: {
          [Collection.Amiibos]: {
            ids: MockCollection.items.map(({ id }) => id),
            entities: MockCollection.items.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
            linkState: LinkState.Linked,
          },
        },
      },
    });

    const expected = cold('(a|)', {
      a: { item: MockCollection.itemNotAcquired, collection: Collection.Amiibos },
    });
    expect(resolver.resolve(getMockRoute('uid2', Collection.Amiibos))).toBeObservable(expected);
    expect(firestoreService.findById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Amiibos }));
  });

  it('should resolve from online data', () => {
    store.setState({ collection: { collections: { [Collection.Games]: { linkState: LinkState.Loading } } } });
    firestoreService.findById.mockReturnValue(of(MockCollection.itemNotAcquired));

    const expected = cold('(a|)', {
      a: { item: MockCollection.itemNotAcquired, collection: Collection.Games },
    });
    expect(resolver.resolve(getMockRoute('uid2', Collection.Games))).toBeObservable(expected);
    expect(firestoreService.findById).toHaveBeenCalledWith(Collection.Games, 'uid2');
    expect(store.dispatch).not.toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Games }));
  });

  it('should dispatch NotFound', () => {
    // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
    store.setState({
      collection: {
        collections: {
          [Collection.Amiibos]: {
            ids: MockCollection.items.map(({ id }) => id),
            entities: MockCollection.items.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
            linkState: LinkState.Linked,
          },
        },
      },
    });
    firestoreService.findById.mockReturnValue(of(undefined));

    const expected = cold('#', undefined, 'Item not found');
    expect(resolver.resolve(getMockRoute('uid3', Collection.Books))).toBeObservable(expected);
    expect(firestoreService.findById).toHaveBeenCalledWith(Collection.Books, 'uid3');
    expect(store.dispatch).toHaveBeenCalledWith(collectionDetailActions.notFound({ collection: Collection.Books }));
  });
});
