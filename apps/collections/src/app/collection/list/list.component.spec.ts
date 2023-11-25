import { CdkVirtualForOf } from '@angular/cdk/scrolling';
import { fakeAsync, tick } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';

import { layoutActions } from '~app/core/layout/layout.actions';
import { layoutFeature } from '~app/core/layout/layout.feature';
import { routerActions } from '~app/core/router/router.actions';
import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { ItemToDisplay } from '~shared/models/item-to-display';
import { MockCollection } from '~tests/mocks/collection';

import { collectionListActions } from './list.actions';
import { ListComponent } from './list.component';
import { listFeature } from './list.feature';
import * as listSelectors from './list.selectors';
import { collectionsActions } from '../core/entities/collections.actions';

describe('ListComponent', () => {
  ngMocks.faster();

  let fixture: MockedComponentFixture<ListComponent>;
  let store: MockStore;
  const data$ = new BehaviorSubject({ collection: Collection.Games });
  const itemToDisplay: ItemToDisplay = {
    id: MockCollection.game1.id,
    predicate: '',
    title: MockCollection.game1.title,
    subTitle: MockCollection.gameBoys.name,
    image: MockCollection.game1.cover,
    acquired: MockCollection.game1.acquired,
  };

  const selectorSpy = jest.fn().mockReturnValue([itemToDisplay]);
  const selectorFactorySpy = jest
    .spyOn(listSelectors, 'selectItemsFactory')
    .mockReturnValue(
      selectorSpy as unknown as MemoizedSelector<
        Record<string, unknown>,
        ItemToDisplay[],
        (s1: ItemToDisplay[], s2: string) => ItemToDisplay[]
      >
    );

  beforeAll(() =>
    MockBuilder(ListComponent)
      .provide(
        provideMockStore({
          initialState: { collection: { collections: { games: { ids: [], entities: [] } } } },
          selectors: [
            { selector: listFeature.selectScrollIndex, value: 5 },
            { selector: layoutFeature.selectSearchPredicate, value: '' },
          ],
        })
      )
      .provide({ provide: ActivatedRoute, useValue: { data: data$ } })
  );

  beforeEach(fakeAsync(() => {
    fixture = MockRender(ListComponent, undefined, false);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    jest.spyOn(fixture.componentInstance.viewport, 'scrollToIndex');

    tick(1);
  }));

  it('should restore scroll index', () => {
    expect(fixture.componentInstance.viewport.scrollToIndex).toHaveBeenCalledWith(5);
  });

  it('should save scroll index', () => {
    ngMocks.output('cdk-virtual-scroll-viewport', 'scrolledIndexChange').emit(0);
    expect(store.dispatch).toHaveBeenCalledWith(collectionListActions.saveScrollIndex({ scrollIndex: 0 }));
  });

  it('should display correct title on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      layoutActions.setToolbar({
        toolbarConfig: {
          title: metas[Collection.Games].title,
          actions: [
            { icon: 'add', onAction: routerActions.navigate({ commands: [Collection.Games, 'new'] }) },
            { icon: 'search', onAction: layoutActions.openSearchBar() },
          ],
        },
      })
    );
  });

  it('should create item selector', () => {
    expect(selectorFactorySpy).toHaveBeenCalledWith(Collection.Games);
  });

  it('should open search bar', () => {
    layoutFeature.selectSearchPredicate.setResult('test');
    store.refreshState();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.openSearchBar());
  });

  describe('with game', () => {
    beforeEach(() => {
      const truc = ngMocks.findInstance(CdkVirtualForOf);
      ngMocks.render(truc, truc, itemToDisplay);

      fixture.detectChanges();
    });

    it('should display a list item', () => {
      expect(ngMocks.findInstance('li:nth-of-type(1)', RouterLink).routerLink).toEqual([MockCollection.game1.id]);
      expect(ngMocks.find('li:nth-of-type(1) img').attributes['src']).toContain(MockCollection.game1.cover);
      expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) h3'))).toContain(MockCollection.game1.title);
      expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) p'))).toContain(MockCollection.gameBoys.name);
      expect(ngMocks.findInstance('li:nth-of-type(1) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.game1.acquired);
    });

    it('should save game when toggle acquired', () => {
      ngMocks.output('mat-checkbox:nth-of-type(1)', 'change').emit({ checked: true });
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(
        collectionsActions.save({
          collection: Collection.Games,
          item: {
            id: MockCollection.game1.id,
            acquired: true,
          },
        })
      );
    });
  });
});
