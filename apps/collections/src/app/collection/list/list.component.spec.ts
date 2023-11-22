import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { ReplaySubject } from 'rxjs';

import { layoutActions } from '~app/core/layout/layout.actions';
import * as layoutSelectors from '~app/core/layout/layout.selectors';
import { routerActions } from '~app/core/router/router.actions';
import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { MockCollection } from '~tests/mocks/collection';

import { collectionListActions } from './list.actions';
import { ListComponent } from './list.component';
import { ListModule } from './list.module';
import * as listSelectors from './list.selectors';
import { collectionsActions } from '../core/entities/collections.actions';

describe('ListComponent', () => {
  ngMocks.faster();

  let fixture: MockedComponentFixture<ListComponent>;
  let store: MockStore;
  const data$ = new ReplaySubject<{ collection: Collection }>(1);

  const render = async () => {
    fixture = MockRender(ListComponent, undefined, false);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    jest.spyOn(fixture.componentInstance.viewport, 'scrollToIndex').mockImplementation(() => {
      /* TG eslint */
    });

    await fixture.whenStable();
  };

  beforeAll(async () => {
    await MockBuilder(ListComponent, ListModule)
      .keep(ScrollingModule)
      .provide(
        provideMockStore({
          initialState: { collection: { collections: { games: { ids: [], entities: [] } } } },
          selectors: [
            { selector: listSelectors.selectScrollIndex, value: 5 },
            { selector: layoutSelectors.selectSearch, value: null },
            { selector: layoutSelectors.selectSearchPredicate, value: '' },
          ],
        })
      )
      .provide({ provide: ActivatedRoute, useValue: { data: data$ } });
  });

  describe('Games', () => {
    beforeAll(() => {
      data$.next({ collection: Collection.Games });
    });

    beforeEach(render);

    it('should restore scroll index', () => {
      expect(fixture.componentInstance.viewport.scrollToIndex).toHaveBeenCalledWith(5);
    });

    it('should save scroll index', () => {
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

    describe('with game', () => {
      beforeEach(() => {
        // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
        store.setState({
          collection: {
            collections: {
              [Collection.Games]: {
                ids: MockCollection.games.map(({ id }) => id),
                entities: MockCollection.games.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
                linkState: LinkState.Linked,
              },
              [Collection.Consoles]: {
                ids: MockCollection.consoles.map(({ id }) => id),
                entities: MockCollection.consoles.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
                linkState: LinkState.Linked,
              },
            },
          },
        });
        fixture.detectChanges();
      });

      it('should display a list of games ordered', () => {
        expect(ngMocks.findAll('li').length).toBe(2);

        expect(ngMocks.find('li:nth-of-type(1)[ng-reflect-router-link="uid1"]')).not.toBeNull();
        expect(ngMocks.input('li:nth-of-type(1) img', 'ngSrc')).toContain(MockCollection.game1.cover);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) h3'))).toContain(MockCollection.game1.title);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) p'))).toContain(MockCollection.gameBoys.name);
        expect(ngMocks.findInstance('li:nth-of-type(1) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.game1.acquired);

        expect(ngMocks.find('li:nth-of-type(2)[ng-reflect-router-link="uid2"]')).not.toBeNull();
        expect(ngMocks.input('li:nth-of-type(2) img', 'ngSrc')).toContain(MockCollection.game2.cover);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) h3'))).toContain(MockCollection.game2.title);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) p'))).toContain(MockCollection.gameBoys.name);
        expect(ngMocks.findInstance('li:nth-of-type(2) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.game2.acquired);
      });

      it('should display game from search', () => {
        layoutSelectors.selectSearch.setResult('recherche');
        store.refreshState();
        fixture.detectChanges();

        expect(ngMocks.findAll('li').length).toBe(1);
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

  describe('Amiibos', () => {
    beforeAll(() => {
      data$.next({ collection: Collection.Amiibos });
    });

    beforeEach(render);

    it('should display correct title on init', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        layoutActions.setToolbar({
          toolbarConfig: {
            title: metas[Collection.Amiibos].title,
            actions: [
              { icon: 'add', onAction: routerActions.navigate({ commands: [Collection.Amiibos, 'new'] }) },
              { icon: 'search', onAction: layoutActions.openSearchBar() },
            ],
          },
        })
      );
    });

    describe('with amiibos', () => {
      beforeEach(() => {
        // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
        store.setState({
          collection: {
            collections: {
              [Collection.Amiibos]: {
                ids: MockCollection.amiibos.map(({ id }) => id),
                entities: MockCollection.amiibos.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
                linkState: LinkState.Linked,
              },
            },
          },
        });
        fixture.detectChanges();
      });

      it('should display a list of amiibos ordered', () => {
        expect(ngMocks.findAll('li').length).toBe(2);

        expect(ngMocks.find('li:nth-of-type(1)[ng-reflect-router-link="uid1"]')).not.toBeNull();
        expect(ngMocks.input('li:nth-of-type(1) img', 'ngSrc')).toContain(MockCollection.amiibo1.image);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) h3'))).toContain(MockCollection.amiibo1.character);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) p'))).toContain(MockCollection.amiibo1.serie);
        expect(ngMocks.findInstance('li:nth-of-type(1) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.amiibo1.acquired);

        expect(ngMocks.find('li:nth-of-type(2)[ng-reflect-router-link="uid2"]')).not.toBeNull();
        expect(ngMocks.input('li:nth-of-type(2) img', 'ngSrc')).toContain(MockCollection.amiibo2.image);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) h3'))).toContain(MockCollection.amiibo2.character);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) p'))).toContain(MockCollection.amiibo2.serie);
        expect(ngMocks.findInstance('li:nth-of-type(2) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.amiibo2.acquired);
      });

      it('should save amiibo when toggle acquired', () => {
        ngMocks.output('mat-checkbox:nth-of-type(1)', 'change').emit({ checked: true });
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(
          collectionsActions.save({
            collection: Collection.Amiibos,
            item: {
              id: MockCollection.amiibo1.id,
              acquired: true,
            },
          })
        );
      });
    });
  });

  describe('Vinyles', () => {
    beforeAll(() => {
      data$.next({ collection: Collection.Vinyles });
    });

    beforeEach(render);

    it('should display correct title on init', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        layoutActions.setToolbar({
          toolbarConfig: {
            title: metas[Collection.Vinyles].title,
            actions: [
              { icon: 'add', onAction: routerActions.navigate({ commands: [Collection.Vinyles, 'new'] }) },
              { icon: 'search', onAction: layoutActions.openSearchBar() },
            ],
          },
        })
      );
    });

    describe('with vinyles', () => {
      beforeEach(() => {
        // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
        store.setState({
          collection: {
            collections: {
              [Collection.Vinyles]: {
                ids: MockCollection.vinyles.map(({ id }) => id),
                entities: MockCollection.vinyles.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
                linkState: LinkState.Linked,
              },
            },
          },
        });
        fixture.detectChanges();
      });

      it('should display a list of vinyles ordered', () => {
        expect(ngMocks.findAll('li').length).toBe(2);

        expect(ngMocks.find('li:nth-of-type(1)[ng-reflect-router-link="uid1"]')).not.toBeNull();
        expect(ngMocks.input('li:nth-of-type(1) img', 'ngSrc')).toContain(MockCollection.vinyle1.cover);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) h3'))).toContain(MockCollection.vinyle1.title);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) p'))).toContain(MockCollection.vinyle1.artist);
        expect(ngMocks.findInstance('li:nth-of-type(1) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.vinyle1.acquired);

        expect(ngMocks.find('li:nth-of-type(2)[ng-reflect-router-link="uid2"]')).not.toBeNull();
        expect(ngMocks.input('li:nth-of-type(2) img', 'ngSrc')).toContain(MockCollection.vinyle2.cover);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) h3'))).toContain(MockCollection.vinyle2.title);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) p'))).toContain(MockCollection.vinyle1.artist);
        expect(ngMocks.findInstance('li:nth-of-type(2) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.vinyle2.acquired);
      });

      it('should save vinyles when toggle acquired', () => {
        ngMocks.output('mat-checkbox:nth-of-type(1)', 'change').emit({ checked: true });
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(
          collectionsActions.save({
            collection: Collection.Vinyles,
            item: {
              id: MockCollection.vinyle1.id,
              acquired: true,
            },
          })
        );
      });
    });
  });

  describe('Books', () => {
    beforeAll(() => {
      data$.next({ collection: Collection.Books });
    });

    beforeEach(render);

    it('should display correct title on init', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        layoutActions.setToolbar({
          toolbarConfig: {
            title: metas[Collection.Books].title,
            actions: [
              { icon: 'add', onAction: routerActions.navigate({ commands: [Collection.Books, 'new'] }) },
              { icon: 'search', onAction: layoutActions.openSearchBar() },
            ],
          },
        })
      );
    });

    describe('with books', () => {
      beforeEach(() => {
        // TODO: find a better way with jest: https://github.com/ngrx/platform/issues/3107#issuecomment-985184507
        store.setState({
          collection: {
            collections: {
              [Collection.Books]: {
                ids: MockCollection.books.map(({ id }) => id),
                entities: MockCollection.books.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
                linkState: LinkState.Linked,
              },
            },
          },
        });
        fixture.detectChanges();
      });

      it('should display a list of books ordered', () => {
        expect(ngMocks.findAll('li').length).toBe(2);

        expect(ngMocks.findInstance('li:nth-of-type(1)', RouterLink).routerLink).toEqual([MockCollection.book1.id]);
        expect(ngMocks.input('li:nth-of-type(1) img', 'ngSrc')).toContain(MockCollection.book1.image);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) h3'))).toContain(MockCollection.book1.title);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(1) p'))).toContain(
          `${MockCollection.book1.publisher} - ${MockCollection.book1.authors}`
        );
        expect(ngMocks.findInstance('li:nth-of-type(1) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.book1.acquired);

        expect(ngMocks.findInstance('li:nth-of-type(2)', RouterLink).routerLink).toEqual([MockCollection.book2.id]);
        expect(ngMocks.input('li:nth-of-type(2) img', 'ngSrc')).toContain(MockCollection.book2.image);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) h3'))).toContain(MockCollection.book2.title);
        expect(ngMocks.formatText(ngMocks.find('li:nth-of-type(2) p'))).toContain(
          `${MockCollection.book2.publisher} - ${MockCollection.book2.authors.join(', ')}`
        );
        expect(ngMocks.findInstance('li:nth-of-type(2) mat-checkbox', MatCheckbox).checked).toBe(MockCollection.book2.acquired);
      });

      it('should display book from search', () => {
        layoutSelectors.selectSearch.setResult('recherche');
        store.refreshState();
        fixture.detectChanges();

        expect(ngMocks.findAll('li').length).toBe(1);
      });

      it('should save books when toggle acquired', () => {
        ngMocks.output('mat-checkbox:nth-of-type(1)', 'change').emit({ checked: true });
        fixture.detectChanges();

        expect(store.dispatch).toHaveBeenCalledWith(
          collectionsActions.save({
            collection: Collection.Books,
            item: {
              id: MockCollection.book1.id,
              acquired: true,
            },
          })
        );
      });
    });
  });
});
