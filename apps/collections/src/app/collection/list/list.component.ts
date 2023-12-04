import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { delay, filter, first, switchMap } from 'rxjs/operators';

import { hasValue } from '@ng-mono/shared';
import { layoutActions } from '~app/core/layout/layout.actions';
import { layoutFeature } from '~app/core/layout/layout.feature';
import { routerActions } from '~app/core/router/router.actions';
import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';
import { ItemToDisplay } from '~shared/models/item-to-display';

import { collectionListActions } from './list.actions';
import { listFeature } from './list.feature';
import * as listSelectors from './list.selectors';
import { collectionsActions } from '../core/entities/collections.actions';

@Component({
  selector: 'col-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, MatCheckboxModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, AfterViewInit {
  collection!: Collection;
  items$: Observable<ItemToDisplay[]> = this.route.data.pipe(
    switchMap(({ collection }) => {
      this.collection = collection;
      this.setToolbar(collection);
      return this.store.select(listSelectors.selectItemsFactory(collection));
    })
  );

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport!: CdkVirtualScrollViewport;

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(layoutFeature.selectSearchPredicate)
      .pipe(
        filter((search) => search.length > 0),
        first()
      )
      .subscribe(() => this.store.dispatch(layoutActions.openSearchBar()));
  }

  ngAfterViewInit(): void {
    this.store
      .select(listFeature.selectScrollIndex)
      .pipe(first(), filter(hasValue), delay(1))
      .subscribe((index) => {
        this.viewport.scrollToIndex(index);
      });
  }

  setToolbar(collection: Collection): void {
    this.store.dispatch(
      layoutActions.setToolbar({
        toolbarConfig: {
          title: metas[collection].title,
          actions: [
            { icon: 'add', onAction: routerActions.navigate({ commands: [collection, 'new'] }) },
            { icon: 'search', onAction: layoutActions.openSearchBar() },
          ],
        },
      })
    );
  }

  toggleAcquired(event: MatCheckboxChange, id: string): void {
    this.store.dispatch(collectionsActions.save({ collection: this.collection, item: { id, acquired: event.checked } }));
  }

  saveCurrentIndex(scrollIndex: number): void {
    this.store.dispatch(collectionListActions.saveScrollIndex({ scrollIndex }));
  }

  titleTrackFn = (_: number, item: ItemToDisplay) => item.title;
}
