import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import * as collectionReducer from './collection.reducer';
import { CollectionRoutingModule } from './collection.routing';
import { CollectionsEffects } from './core/entities/collections.effects';
import { DetailModule } from './detail/detail.module';
import { ListModule } from './list/list.module';

@NgModule({
  imports: [
    CommonModule,
    ListModule,
    DetailModule,
    CollectionRoutingModule,
    StoreModule.forFeature('collection', collectionReducer.reducer),
    EffectsModule.forFeature([CollectionsEffects]),
  ],
})
export class CollectionModule {}
