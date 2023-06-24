import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { UntilDestroy } from '@ngneat/until-destroy';

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

@UntilDestroy()
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
  itemRelation$ = this.store.select(collectionsSelectors.selectAllFactory<Console>(Collection.Consoles));

  get titleControl(): FormControl<string> {
    return this.form.controls.title;
  }

  initForm(): string {
    const game = this.item;

    this.form = this.formBuilder.nonNullable.group({
      id: [game.id, [Validators.required]],
      acquired: [game.acquired, [Validators.required]],
      title: [game.title, [Validators.required]],
      console: [game.console, [Validators.required]],
      maxPrice: [game.maxPrice, [Validators.min(0)]],
      cover: [game.cover, [Validators.required]],
      comment: [{ value: game.comment, disabled: false }],
    });

    return game.title;
  }
}
