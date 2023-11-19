import { fakeAsync, tick } from '@angular/core/testing';
import { FormControlName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';

import { layoutActions } from '~app/core/layout/layout.actions';
import { Collection } from '~shared/enums/collection';
import { LinkState } from '~shared/enums/link-state';
import { SaveState } from '~shared/enums/save-state';
import { Game } from '~shared/models/game';
import { Item } from '~shared/models/item';
import { MockCollection } from '~tests/mocks/collection';

import { GameDetailComponent } from './game-detail.component';
import { collectionsActions } from '../../core/entities/collections.actions';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { collectionDetailActions } from '../core/store/detail.actions';
import * as detailSelectors from '../core/store/detail.selectors';

describe('GameDetailComponent', () => {
  ngMocks.faster();

  let fixture: MockedComponentFixture<GameDetailComponent>;
  let store: MockStore;
  const dialogRef = {
    afterClosed: jest.fn(),
  };
  const dialog = {
    open: jest.fn(),
  };
  const fakeToolbarConfig = (title: string, icon: string) => ({
    toolbarConfig: {
      title,
      actions: [
        { icon, color: 'rgba(255,255,255,.4)' },
        {
          icon: 'delete_forever',
          onAction: collectionDetailActions.openDeletePopup(),
        },
      ],
    },
  });

  const data$ = new ReplaySubject<{ itemCollection: { item: Item; collection: Collection } }>(1);

  beforeAll(() =>
    MockBuilder(GameDetailComponent)
      .keep(FormsModule)
      .keep(ReactiveFormsModule)
      .provide(
        provideMockStore({
          selectors: [
            { selector: detailSelectors.selectLoading, value: false },
            { selector: detailSelectors.selectSaveState, value: SaveState.Unchanged },
          ],
        })
      )
      .provide({ provide: ActivatedRoute, useValue: { data: data$ } })
      .provide({ provide: MatDialog, useValue: dialog })
      .keep(NG_MOCKS_ROOT_PROVIDERS)
  );

  beforeEach(async () => {
    fixture = MockRender(GameDetailComponent, undefined, false);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    store.setState({
      collection: {
        collections: {
          [Collection.Consoles]: {
            ids: MockCollection.consoles.map(({ id }) => id),
            entities: MockCollection.consoles.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
            linkState: LinkState.Linked,
          },
        },
      },
    });

    data$.next({ itemCollection: { collection: Collection.Games, item: MockCollection.game2 } });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should toggle loader', () => {
    expect(ngMocks.find('col-loader', null)).toBeNull();

    detailSelectors.selectLoading.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    expect(ngMocks.find('col-loader')).not.toBeNull();
  });

  it('should set header title with game title', () => {
    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig(MockCollection.game2.title, 'cloud')));
  });

  it('should display current Game', () => {
    expect(ngMocks.findInstance('[formControlName="title"]', FormControlName).value).toBe(MockCollection.game2.title);
    expect(ngMocks.findInstance('[formControlName="acquired"]', FormControlName).value).toBe(MockCollection.game2.acquired);
    expect(ngMocks.findInstance('[formControlName="console"]', FormControlName).value).toBe(MockCollection.game2.console);
    expect(ngMocks.findInstance('[formControlName="maxPrice"]', FormControlName).value).toBe(MockCollection.game2.maxPrice);
  });

  it('should display list of console', () => {
    expect(ngMocks.findAll('mat-option').length).toBe(2);
  });

  it('should update header title when game title change', fakeAsync(() => {
    ngMocks.change('[formControlName="title"]', 'Toto');
    tick(200);

    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig('Toto', 'cloud')));
  }));

  it('should save valid game automatically', fakeAsync(() => {
    ngMocks.change('[formControlName="title"]', 'Toto');
    ngMocks.change('[formControlName="maxPrice"]', 20);
    ngMocks.change('[formControlName="acquired"]', false);
    ngMocks.change('[formControlName="console"]', 'game-cube');
    ngMocks.change('[formControlName="comment"]', 'An comment');
    tick(200);

    expect(store.dispatch).toHaveBeenCalledWith(
      collectionsActions.save({
        collection: Collection.Games,
        item: {
          ...MockCollection.game2,
          title: 'Toto',
          acquired: false,
          maxPrice: 20,
          console: 'game-cube',
          comment: 'An comment',
        } as Game,
      })
    );
  }));

  it('should not save invalid game automatically', fakeAsync(() => {
    ngMocks.change('[formControlName="title"]', '');
    tick(200);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: collectionsActions.save.type }));
  }));

  it('should delete a game', () => {
    dialogRef.afterClosed.mockReturnValue(of(true));
    dialog.open.mockReturnValue(dialogRef);
    store.dispatch(collectionDetailActions.openDeletePopup());

    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Attention',
        content: 'Êtes-vous sûr ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
      },
    });
    expect(store.dispatch).toHaveBeenCalledWith(collectionsActions.delete({ collection: Collection.Games, id: MockCollection.game2.id }));
  });

  it('should prevent to delete a game', () => {
    dialogRef.afterClosed.mockReturnValue(of(false));
    dialog.open.mockReturnValue(dialogRef);
    store.dispatch(collectionDetailActions.openDeletePopup());

    expect(store.dispatch).not.toHaveBeenCalledWith(
      collectionsActions.delete({ collection: Collection.Games, id: MockCollection.game2.id })
    );
  });

  it('should change toolbar icon when saving', () => {
    detailSelectors.selectSaveState.setResult(SaveState.Saving);
    store.refreshState();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig(MockCollection.game2.title, 'cloud_upload')));
  });

  it('should change toolbar icon when saved', () => {
    detailSelectors.selectSaveState.setResult(SaveState.Saved);
    store.refreshState();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig(MockCollection.game2.title, 'cloud_done')));
  });
});
