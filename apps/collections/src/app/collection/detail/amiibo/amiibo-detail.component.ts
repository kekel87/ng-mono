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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
