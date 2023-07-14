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

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { Amiibo } from '~shared/models/amiibo';

import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { DetailComponent as DetailComponent } from '../core/components/detail/detail.component';
import { ImageSelectorComponent } from '../core/components/image-selector/image-selector.component';

type AmiiboForm = FormGroup<{
  id: FormControl<string>;
  acquired: FormControl<boolean>;
  character: FormControl<string>;
  serie: FormControl<string>;
  image: FormControl<string>;
  comment: FormControl<string | undefined>;
}>;

@Component({
  standalone: true,
  selector: 'col-amiibo-detail',
  templateUrl: './amiibo-detail.component.html',
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
export class AmiiboDetailComponent extends DetailComponent<Amiibo, AmiiboForm> {
  get titleControl(): FormControl<string> {
    return this.form.controls.character;
  }

  initForm(): string {
    const amiibo = this.item;

    this.form = this.formBuilder.nonNullable.group({
      id: [amiibo.id, [Validators.required]],
      acquired: [amiibo.acquired, [Validators.required]],
      character: [amiibo.character, [Validators.required]],
      serie: [amiibo.serie, [Validators.required]],
      image: [amiibo.image, [Validators.required]],
      comment: [{ value: amiibo.comment, disabled: false }],
    });

    return amiibo.character;
  }
}
