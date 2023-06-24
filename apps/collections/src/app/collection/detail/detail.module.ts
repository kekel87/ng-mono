import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { AmiiboDetailComponent } from './amiibo/amiibo-detail.component';
import { ComicBookDetailComponent } from './comic-book/comic-book-detail.component';
import { DetailEffects } from './core/store/detail.effects';
import { GameDetailComponent } from './game/game-detail.component';
import { VinyleDetailComponent } from './vinyle/vinyle-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([DetailEffects]),
    AmiiboDetailComponent,
    ComicBookDetailComponent,
    GameDetailComponent,
    VinyleDetailComponent,
  ],
})
export class DetailModule {}
