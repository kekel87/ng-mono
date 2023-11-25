import { fakeAsync, tick } from '@angular/core/testing';
import { FormControlName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';

import { layoutActions } from '~app/core/layout/layout.actions';
import { Collection } from '~shared/enums/collection';
import { SaveState } from '~shared/enums/save-state';
import { Item } from '~shared/models/item';
import { Vinyle } from '~shared/models/vinyle';
import { MockCollection } from '~tests/mocks/collection';

import { VinyleDetailComponent } from './vinyle-detail.component';
import { collectionsActions } from '../../core/entities/collections.actions';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { collectionDetailActions } from '../core/store/detail.actions';
import { detailFeature } from '../core/store/detail.feature';

describe('VinyleDetailComponent', () => {
  ngMocks.faster();

  let fixture: MockedComponentFixture<VinyleDetailComponent>;
  let store: MockStore;
  const dialogRef = { afterClosed: jest.fn() };
  const dialog = { open: jest.fn() };
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
    MockBuilder(VinyleDetailComponent)
      .keep(FormsModule)
      .keep(ReactiveFormsModule)
      .provide(
        provideMockStore({
          selectors: [
            { selector: detailFeature.selectLoading, value: false },
            { selector: detailFeature.selectSaveState, value: SaveState.Unchanged },
          ],
        })
      )
      .provide({ provide: ActivatedRoute, useValue: { data: data$ } })
      .provide({ provide: MatDialog, useValue: dialog })
      .keep(NG_MOCKS_ROOT_PROVIDERS)
  );

  beforeEach(async () => {
    fixture = MockRender(VinyleDetailComponent, undefined, false);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    data$.next({ itemCollection: { collection: Collection.Vinyles, item: MockCollection.vinyle2 } });

    fixture.detectChanges();
  });

  it('should set header title with vinyle title', () => {
    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig(MockCollection.vinyle2.title, 'cloud')));
  });

  it('should display current Vinyle', () => {
    expect(ngMocks.findInstance('[formControlName="title"]', FormControlName).value).toBe(MockCollection.vinyle2.title);
    expect(ngMocks.findInstance('[formControlName="acquired"]', FormControlName).value).toBe(MockCollection.vinyle2.acquired);
    expect(ngMocks.findInstance('[formControlName="artist"]', FormControlName).value).toBe(MockCollection.vinyle2.artist);
  });

  it('should update header title when title change', fakeAsync(() => {
    ngMocks.change('[formControlName="title"]', 'Toto');
    tick(200);

    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig('Toto', 'cloud')));
  }));

  it('should save vinyle with modification', fakeAsync(() => {
    ngMocks.change('[formControlName="title"]', 'Toto');
    ngMocks.change('[formControlName="artist"]', 'ACDC');
    ngMocks.change('[formControlName="acquired"]', false);
    ngMocks.change('[formControlName="comment"]', 'An comment');
    tick(200);

    expect(store.dispatch).toHaveBeenCalledWith(
      collectionsActions.save({
        collection: Collection.Vinyles,
        item: {
          ...MockCollection.vinyle2,
          title: 'Toto',
          acquired: false,
          artist: 'ACDC',
          comment: 'An comment',
        } as Vinyle,
      })
    );
  }));

  it('should delete a vinyle', () => {
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
        collection: Collection.Vinyles,
        id: MockCollection.vinyle2.id,
      })
    );
  });
});
