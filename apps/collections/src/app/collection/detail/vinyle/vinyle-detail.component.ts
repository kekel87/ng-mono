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
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { UntilDestroy } from '@ngneat/until-destroy';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { Vinyle } from '~shared/models/vinyle';

import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { DetailComponent } from '../core/components/detail/detail.component';
import { ImageSelectorComponent } from '../core/components/image-selector/image-selector.component';

type VinyleForm = FormGroup<{
  id: FormControl<string>;
  acquired: FormControl<boolean>;
  title: FormControl<string>;
  artist: FormControl<string>;
  cover: FormControl<string>;
  comment: FormControl<string | undefined>;
}>;

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'col-vinyle-detail',
  templateUrl: './vinyle-detail.component.html',
  styleUrls: ['../core/components/detail/detail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    LoaderComponent,
    ConfirmDialogComponent,
    ImageSelectorComponent,
  ],
})
export class VinyleDetailComponent extends DetailComponent<Vinyle, VinyleForm> {
  get titleControl(): FormControl<string> {
    return this.form.controls.title;
  }

  initForm(): string {
    const vinyle = this.item;

    this.form = this.formBuilder.nonNullable.group({
      id: [vinyle.id, [Validators.required]],
      acquired: [vinyle.acquired, [Validators.required]],
      title: [vinyle.title, [Validators.required]],
      artist: [vinyle.artist, [Validators.required]],
      cover: [vinyle.cover, [Validators.required]],
      comment: [{ value: vinyle.comment, disabled: false }],
    });

    return vinyle.title;
  }
}
