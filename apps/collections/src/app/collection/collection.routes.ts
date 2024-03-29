import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { Collection } from '~shared/enums/collection';

import { canActivate } from './collection.guard';
import { CollectionsEffects } from './core/entities/collections.effects';
import { collectionsFeature } from './core/entities/collections.feature';
import { AmiiboDetailComponent } from './detail/amiibo/amiibo-detail.component';
import { ComicBookDetailComponent } from './detail/comic-book/comic-book-detail.component';
import { DetailEffects } from './detail/core/store/detail.effects';
import { detailFeature } from './detail/core/store/detail.feature';
import { detailResolver } from './detail/detail.resolver';
import { GameDetailComponent } from './detail/game/game-detail.component';
import { VinyleDetailComponent } from './detail/vinyle/vinyle-detail.component';
import { ListComponent } from './list/list.component';
import { listFeature } from './list/list.feature';
import { listResolver } from './list/list.resolver';

export default [
  {
    path: '',
    providers: [
      provideState(collectionsFeature),
      provideState(detailFeature),
      provideState(listFeature),
      provideEffects(CollectionsEffects, DetailEffects),
    ],
    children: [
      {
        path: ':collection',
        component: ListComponent,
        canActivate: [canActivate],
        resolve: { collection: listResolver },
      },
      {
        path: 'amiibos/:id',
        component: AmiiboDetailComponent,
        resolve: { itemCollection: detailResolver },
        data: { collection: Collection.Amiibos },
      },
      {
        path: 'books/:id',
        component: ComicBookDetailComponent,
        resolve: { itemCollection: detailResolver },
        data: { collection: Collection.Books },
      },
      {
        path: 'games/:id',
        component: GameDetailComponent,
        resolve: { itemCollection: detailResolver },
        data: { collection: Collection.Games },
      },
      {
        path: 'vinyles/:id',
        component: VinyleDetailComponent,
        resolve: { itemCollection: detailResolver },
        data: { collection: Collection.Vinyles },
      },
    ],
  },
] satisfies Routes;
