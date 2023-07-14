import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { Collection } from '~shared/enums/collection';
import { Console } from '~shared/models/console';
import { Game } from '~shared/models/game';

import * as collectionsSelectors from '../../core/entities/collections.selectors';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { DetailComponent } from '../core/components/detail/detail.component';
import { ImageSelectorComponent } from '../core/components/image-selector/image-selector.component';

type GameForm = FormGroup<{
  id: FormControl<string>;
  acquired: FormControl<boolean>;
  title: FormControl<string>;
  console: FormControl<string>;
  maxPrice: FormControl<number>;
  cover: FormControl<string>;
  comment: FormControl<string | undefined>;
}>;

@Component({
  standalone: true,
  selector: 'col-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['../core/components/detail/detail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    LoaderComponent,
    ConfirmDialogComponent,
    ImageSelectorComponent,
  ],
})
export class GameDetailComponent extends DetailComponent<Game, GameForm> {
  get titleControl(): FormControl<string> {
    return this.form.controls.title;
  }

  itemRelation$ = this.store.select(collectionsSelectors.selectAllFactory<Console>(Collection.Consoles));

  initForm(): string {
    const game = this.item;

    this.form = this.formBuilder.nonNullable.group({
      id: game.id,
      acquired: game.acquired,
      title: [game.title, Validators.required],
      console: [game.console, Validators.required],
      maxPrice: [game.maxPrice, Validators.min(0)],
      cover: game.cover,
      comment: game.comment,
    });

    return game.title;
  }
}
