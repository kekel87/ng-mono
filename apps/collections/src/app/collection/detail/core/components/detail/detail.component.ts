import { ChangeDetectorRef, Component, DestroyRef, NgZone, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';

import { layoutActions } from '~app/core/layout/layout.actions';
import { Collection } from '~shared/enums/collection';
import { SaveState } from '~shared/enums/save-state';
import { Item } from '~shared/models/item';

import { collectionsActions } from '../../../../core/entities/collections.actions';
import { collectionDetailActions } from '../../store/detail.actions';
import { detailFeature } from '../../store/detail.feature';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({ template: '' })
export abstract class DetailComponent<T extends Item, F extends FormGroup> {
  item!: T;
  collection!: Collection;
  form!: F;
  loading$: Observable<boolean> = this.store.select(detailFeature.selectLoading);
  saveState$: Observable<SaveState> = this.store.select(detailFeature.selectSaveState);

  readonly Collections = Collection;

  abstract get titleControl(): FormControl<string>;
  protected destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    protected dialog: MatDialog,
    protected changeDetectorRef: ChangeDetectorRef,
    private action$: ActionsSubject,
    protected store: Store,
    protected formBuilder: FormBuilder,
    private ngZone: NgZone
  ) {
    this.route.data
      .pipe(
        map((data) => data['itemCollection']),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ collection, item }: { collection: Collection; item: T }) => {
        this.collection = collection;
        this.item = item;
        this.init();
      });

    this.action$.pipe(ofType(collectionDetailActions.openDeletePopup), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.delete());
  }

  abstract initForm(): string;

  init(): void {
    const title = this.initForm();

    combineLatest([this.titleControl.valueChanges.pipe(debounceTime(200), startWith(title)), this.saveState$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([value, saveState]) => {
        let icon = 'cloud';
        switch (saveState) {
          case SaveState.NotSave:
            icon = 'edit';
            break;
          case SaveState.Saving:
            icon = 'cloud_upload';
            break;
          case SaveState.Saved:
            icon = 'cloud_done';
            break;
        }

        this.store.dispatch(
          layoutActions.setToolbar({
            toolbarConfig: {
              title: value || 'Nouveau',
              actions: [
                { icon, color: 'rgba(255,255,255,.4)' },
                {
                  icon: 'delete_forever',
                  onAction: collectionDetailActions.openDeletePopup(),
                },
              ],
            },
          })
        );
      });

    this.form.valueChanges
      .pipe(
        debounceTime(200),
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.ngZone.run(() => {
            this.store.dispatch(collectionDetailActions.setSaveState({ saveState: SaveState.NotSave }));
            this.changeDetectorRef.markForCheck();
          });
        })
      )
      .subscribe((item) => {
        if (this.form.valid && this.collection) {
          this.ngZone.run(() => {
            this.store.dispatch(collectionsActions.save({ collection: this.collection, item }));
            this.changeDetectorRef.markForCheck();
          });
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  private delete(): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Attention',
          content: 'Êtes-vous sûr ?',
          confirmText: 'Supprimer',
          cancelText: 'Annuler',
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.store.dispatch(collectionsActions.delete({ collection: this.collection, id: this.item.id }));
        }
      });
  }
}
