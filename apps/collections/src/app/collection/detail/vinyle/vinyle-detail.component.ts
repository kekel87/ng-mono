import { AsyncPipe, NgIf } from '@angular/common';
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

import { FullPageLoaderComponent } from '@ng-mono/shared/ui';
import { Vinyle } from '~shared/models/vinyle';

import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { DetailComponent } from '../core/components/detail/detail.component';
import { ImageSelectorComponent } from '../core/components/image-selector/image-selector.component';

type VinyleForm = FormGroup<{
  id: FormControl<string>;
  acquired: FormControl<boolean>;
  title: FormControl<string>;
  artist: FormControl<string>;
  cover: FormControl<string | null>;
  comment: FormControl<string | undefined>;
}>;

@Component({
  selector: 'col-vinyle-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
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
    FullPageLoaderComponent,
    ConfirmDialogComponent,
    ImageSelectorComponent,
  ],
  templateUrl: './vinyle-detail.component.html',
  styleUrls: ['../core/components/detail/detail.component.scss'],
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
