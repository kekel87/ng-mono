import { fakeAsync, tick, flush } from '@angular/core/testing';
import { FormArrayName, FormControlName, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';

import { layoutActions } from '~app/core/layout/layout.actions';
import { Collection } from '~shared/enums/collection';
import { SaveState } from '~shared/enums/save-state';
import { Book } from '~shared/models/book';
import { Item } from '~shared/models/item';
import { MockCollection } from '~tests/mocks/collection';

import { ComicBookDetailComponent } from './comic-book-detail.component';
import { CreateTomesDialogComponent } from './core/components/create-tomes-dialog/create-tomes-dialog.component';
import { TomeDialogComponent } from './core/components/tome-dialog/tome-dialog.component';
import { TomeForm } from './core/models/tome-form';
import { collectionsActions } from '../../core/entities/collections.actions';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { collectionDetailActions } from '../core/store/detail.actions';
import { detailFeature } from '../core/store/detail.feature';

describe('ComicBookDetailComponent', () => {
  ngMocks.faster();

  let fixture: MockedComponentFixture<ComicBookDetailComponent>;
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
    MockBuilder(ComicBookDetailComponent)
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

  beforeEach(() => {
    fixture = MockRender(ComicBookDetailComponent, undefined, false);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  describe('Book', () => {
    beforeEach(async () => {
      data$.next({ itemCollection: { collection: Collection.Books, item: MockCollection.book1 } });

      fixture.detectChanges();
    });

    it('should set header title with book title', () => {
      expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig(MockCollection.book1.title, 'cloud')));
    });

    it('should display current book with tomes', () => {
      expect(ngMocks.findInstance('[formControlName="title"]', FormControlName).value).toBe(MockCollection.book1.title);
      expect(ngMocks.findInstance('[formArrayName="authors"]', FormArrayName).value).toEqual(MockCollection.book1.authors);
      expect(ngMocks.findInstance('[formControlName="publisher"]', FormControlName).value).toBe(MockCollection.book1.publisher);

      expect(ngMocks.findAll('.tomes mat-checkbox').length).toBe(MockCollection.book1.tomes.length);
      expect(ngMocks.findInstance('.tomes > div:nth-of-type(2) mat-checkbox', FormControlName).value).toBe(
        MockCollection.book1.tomes[0].acquired
      );
      expect(ngMocks.findInstance('.tomes > div:nth-of-type(3) mat-checkbox', FormControlName).value).toBe(
        MockCollection.book1.tomes[1].acquired
      );
    });

    it('should update header title when title change', fakeAsync(() => {
      ngMocks.change('[formControlName="title"]', 'Toto');
      tick(200);

      expect(store.dispatch).toHaveBeenCalledWith(layoutActions.setToolbar(fakeToolbarConfig('Toto', 'cloud')));
    }));

    it('should save book with modification', fakeAsync(() => {
      ngMocks.change('[formControlName="title"]', 'Toto');
      ngMocks.change('.author:nth-of-type(1) input', 'New author');
      ngMocks.change('[formControlName="publisher"]', 'New publisher');
      ngMocks.change('.tomes > div:nth-of-type(2) mat-checkbox', true);
      ngMocks.click('.tomes  div button:nth-of-type(1)');

      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        collectionsActions.save({
          collection: Collection.Books,
          item: {
            id: MockCollection.book1.id,
            image: 'assets/400x200.png',
            title: 'Toto',
            acquired: MockCollection.book1.acquired,
            authors: ['New author'],
            publisher: 'New publisher',
            tomes: [
              {
                number: 3,
                acquired: true,
                cover: 'assets/75x118.png',
              },
              {
                ...MockCollection.tome1,
                acquired: true,
              },
              MockCollection.tome2,
            ],
          } as Book,
        })
      );
    }));

    it('should add and remove author', fakeAsync(() => {
      (store.dispatch as unknown as jest.SpyInstance<MockStore>).mockClear();

      ngMocks.change('.author:nth-of-type(1) input', 'New author');
      ngMocks.click('.author button');
      fixture.detectChanges();
      ngMocks.change('.author:nth-of-type(2) input', 'New author 2');

      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        collectionsActions.save({
          collection: Collection.Books,
          item: expect.objectContaining({ authors: ['New author', 'New author 2'] }) as unknown as Book,
        })
      );

      ngMocks.click('.author:nth-of-type(2) button');
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        collectionsActions.save({
          collection: Collection.Books,
          item: expect.objectContaining({ authors: ['New author'] }) as unknown as Book,
        })
      );
    }));

    it('should delete an book', fakeAsync(() => {
      dialogRef.afterClosed.mockReturnValue(of(true));
      dialog.open.mockReturnValue(dialogRef);
      store.dispatch(collectionDetailActions.openDeletePopup());
      flush();

      expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Attention',
          content: 'Êtes-vous sûr ?',
          confirmText: 'Supprimer',
          cancelText: 'Annuler',
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(collectionsActions.delete({ collection: Collection.Books, id: MockCollection.book1.id }));
    }));

    describe('Tomes', () => {
      it('should edit a tome', () => {
        dialogRef.afterClosed.mockReturnValue(of(undefined));
        dialog.open.mockReturnValue(dialogRef);
        ngMocks.click('.tomes > div:nth-of-type(2) img');

        expect(dialog.open).toHaveBeenCalledWith(TomeDialogComponent, {
          width: '300px',
          data: {
            title: MockCollection.book1.title,
            tome: expect.any(FormGroup),
            id: MockCollection.book1.id,
          },
        });
        expect(
          (
            (dialog.open.mock.calls[dialog.open.mock.calls.length - 1][1]?.data as { tome: TomeForm; title: string }).tome as TomeForm
          ).getRawValue()
        ).toEqual(MockCollection.tome1);
      });

      it('should delete a tome', () => {
        dialogRef.afterClosed.mockReturnValue(of(true));
        dialog.open.mockReturnValue(dialogRef);
        ngMocks.click('.tomes > div:nth-of-type(2) img');
        fixture.detectChanges();
        expect(ngMocks.findAll('.tomes > div').length).toBe(2);
      });

      it('should add tome and increment number', () => {
        expect(ngMocks.findAll('.tomes img').length).toBe(2);

        ngMocks.click('.tomes div button:nth-of-type(1)');
        fixture.detectChanges();

        expect(ngMocks.findAll('.tomes img').length).toBe(3);
        expect(fixture.componentInstance.form.controls.tomes.at(0).get('number')?.value).toBe(3);
      });

      it('should add many tome and order then', () => {
        dialogRef.afterClosed.mockReturnValue(of({ from: 3, to: 5 }));
        dialog.open.mockReturnValue(dialogRef);

        expect(ngMocks.findAll('.tomes img').length).toBe(2);

        ngMocks.click('.tomes div button:nth-of-type(2)');
        fixture.detectChanges();

        expect(dialog.open).toHaveBeenCalledWith(CreateTomesDialogComponent, {
          width: '300px',
          data: { start: 3 },
        });
        expect(ngMocks.findAll('.tomes span').map((el) => ngMocks.formatText(el))).toEqual(['5', '4', '3', '2', '1']);
      });

      it('should cancel add many tome', () => {
        dialogRef.afterClosed.mockReturnValue(of(undefined));
        dialog.open.mockReturnValue(dialogRef);

        expect(ngMocks.findAll('.tomes img').length).toBe(2);

        ngMocks.click('.tomes div button:nth-of-type(2)');
        fixture.detectChanges();

        expect(ngMocks.findAll('.tomes img').length).toBe(2);
      });

      it('should hide tome if isOneShot', () => {
        expect(ngMocks.formatText(ngMocks.find('.comment h3'))).toContain('Tomes :');
        expect(ngMocks.findAll('.tomes img').length).toBe(2);

        ngMocks.output('.comment mat-checkbox', 'change').emit({ checked: true });
        fixture.detectChanges();

        expect(ngMocks.find('.comment h3', null)).toBeNull();
        expect(ngMocks.findAll('.tomes img').length).toBe(0);
      });

      it('should set book image with first tome cover', fakeAsync(() => {
        fixture.componentInstance.form.controls.tomes.at(1).get('cover')?.patchValue('img/50x250.png');
        tick(600);
        fixture.detectChanges();

        expect(ngMocks.findInstance('[formControlName="image"]', FormControlName).value).toContain('img/50x250.png');
      }));

      it('should not set book image with other tome', fakeAsync(() => {
        fixture.componentInstance.form.controls.tomes.at(0).get('cover')?.patchValue('img/50x250.png');
        tick(600);
        fixture.detectChanges();

        expect(ngMocks.findInstance('[formControlName="image"]', FormControlName).value).toContain(MockCollection.book1.image);
      }));

      it('should not set book image with first tome if she are already set', fakeAsync(() => {
        ngMocks.change('[formControlName="image"]', 'img/500x50.png');
        tick(200);
        fixture.detectChanges();

        fixture.componentInstance.form.controls.tomes.at(0).get('cover')?.patchValue('img/50x250.png');
        tick(600);
        fixture.detectChanges();

        expect(ngMocks.findInstance('[formControlName="image"]', FormControlName).value).toContain('img/500x50.png');
      }));
    });
  });

  describe('Book with no tome', () => {
    beforeEach(() => {
      data$.next({ itemCollection: { collection: Collection.Books, item: MockCollection.book2 } });

      fixture.detectChanges();
    });

    it('should isOneShot be default', () => {
      expect(ngMocks.findInstance('.comment mat-checkbox', MatCheckbox).checked).toBe(true);
      expect(ngMocks.find('.comment h3', null)).toBeNull();
      expect(ngMocks.findAll('.tomes img').length).toBe(0);
    });

    describe('Tomes', () => {
      beforeEach(() => {
        ngMocks.output('.comment mat-checkbox', 'change').emit({ checked: false });
        fixture.detectChanges();
      });

      it('should add a tome', () => {
        expect(ngMocks.findAll('.tomes img').length).toBe(0);

        ngMocks.click('.tomes div button:nth-of-type(1)');
        fixture.detectChanges();

        expect(ngMocks.findAll('.tomes img').length).toBe(1);
        expect(fixture.componentInstance.form.controls.tomes.at(0).get('number')?.value).toBe(1);
      });

      it('should add many tomes', () => {
        dialogRef.afterClosed.mockReturnValue(of({ from: 1, to: 5 }));
        dialog.open.mockReturnValue(dialogRef);

        expect(ngMocks.findAll('.tomes img').length).toBe(0);

        ngMocks.click('.tomes div button:nth-of-type(2)');
        fixture.detectChanges();

        expect(dialog.open).toHaveBeenCalledWith(CreateTomesDialogComponent, {
          width: '300px',
          data: { start: 1 },
        });
        expect(ngMocks.findAll('.tomes span').map((el) => ngMocks.formatText(el))).toEqual(['5', '4', '3', '2', '1']);
      });
    });
  });
});
