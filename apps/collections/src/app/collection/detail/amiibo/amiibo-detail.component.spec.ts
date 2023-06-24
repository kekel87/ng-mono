import { fakeAsync, tick } from '@angular/core/testing';
import { FormControlName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';

import { layoutActions } from '~app/core/layout/layout.actions';
import { Collection } from '~shared/enums/collection';
import { SaveState } from '~shared/enums/save-state';
import { Amiibo } from '~shared/models/amiibo';
import { Item } from '~shared/models/item';
import { MockCollection } from '~tests/mocks/collection';

import { AmiiboDetailComponent } from './amiibo-detail.component';
import { collectionsActions } from '../../core/entities/collections.actions';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { collectionDetailActions } from '../core/store/detail.actions';
import * as detailSelectors from '../core/store/detail.selectors';

describe('AmiiboDetailComponent', () => {
  ngMocks.faster();

  let fixture: MockedComponentFixture<AmiiboDetailComponent>;
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
    MockBuilder(AmiiboDetailComponent)
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
    fixture = MockRender(AmiiboDetailComponent, undefined, false);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    data$.next({ itemCollection: { collection: Collection.Amiibos, item: MockCollection.amiibo2 } });

    fixture.detectChanges();
  });

  it('should set header title with amiibo character name', () => {
    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig(MockCollection.amiibo2.character, 'cloud')));
  });

  it('should display current Amiibo', () => {
    expect(ngMocks.findInstance('[formControlName="character"]', FormControlName).value).toBe(MockCollection.amiibo2.character);
    expect(ngMocks.findInstance('[formControlName="acquired"]', FormControlName).value).toBe(MockCollection.amiibo2.acquired);
    expect(ngMocks.findInstance('[formControlName="serie"]', FormControlName).value).toBe(MockCollection.amiibo2.serie);
  });

  it('should update header title when character name change', fakeAsync(() => {
    ngMocks.change('[formControlName="character"]', 'Toto');
    tick(200);

    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig('Toto', 'cloud')));
  }));

  it('should save valid Amiibo automatically', fakeAsync(() => {
    ngMocks.change('[formControlName="character"]', 'Toto');
    ngMocks.change('[formControlName="serie"]', 'The legend of Zelda');
    ngMocks.change('[formControlName="acquired"]', false);
    ngMocks.change('[formControlName="comment"]', 'An comment');
    tick(200);

    expect(store.dispatch).toHaveBeenCalledWith(
      collectionsActions.save({
        collection: Collection.Amiibos,
        item: {
          ...MockCollection.amiibo2,
          character: 'Toto',
          acquired: false,
          serie: 'The legend of Zelda',
          comment: 'An comment',
        } as Amiibo,
      })
    );
  }));

  it('should delete an Amiibo', () => {
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
    expect(store.dispatch).toHaveBeenCalledWith(
      collectionsActions.delete({
        collection: Collection.Amiibos,
        id: MockCollection.amiibo2.id,
      })
    );
  });
});
