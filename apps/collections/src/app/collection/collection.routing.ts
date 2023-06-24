import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Collection } from '~shared/enums/collection';

import { CollectionGuard } from './collection.guard';
import { AmiiboDetailComponent } from './detail/amiibo/amiibo-detail.component';
import { ComicBookDetailComponent } from './detail/comic-book/comic-book-detail.component';
import { DetailResolver } from './detail/detail.resolver';
import { GameDetailComponent } from './detail/game/game-detail.component';
import { VinyleDetailComponent } from './detail/vinyle/vinyle-detail.component';
import { ListComponent } from './list/list.component';
import { ListResolver } from './list/list.resolver';

const routes: Routes = [
  {
    path: ':collection',
    component: ListComponent,
    canActivate: [CollectionGuard],
    resolve: { collection: ListResolver },
  },
  {
    path: 'amiibos/:id',
    component: AmiiboDetailComponent,
    resolve: { itemCollection: DetailResolver },
    data: { collection: Collection.Amiibos },
  },
  {
    path: 'books/:id',
    component: ComicBookDetailComponent,
    resolve: { itemCollection: DetailResolver },
    data: { collection: Collection.Books },
  },
  {
    path: 'comics/:id',
    component: ComicBookDetailComponent,
    resolve: { itemCollection: DetailResolver },
    data: { collection: Collection.Comics },
  },
  {
    path: 'games/:id',
    component: GameDetailComponent,
    resolve: { itemCollection: DetailResolver },
    data: { collection: Collection.Games },
  },
  {
    path: 'vinyles/:id',
    component: VinyleDetailComponent,
    resolve: { itemCollection: DetailResolver },
    data: { collection: Collection.Vinyles },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionRoutingModule {}
