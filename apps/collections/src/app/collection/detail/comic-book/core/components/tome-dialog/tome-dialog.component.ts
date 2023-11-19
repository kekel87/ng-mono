import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ImageSelectorComponent } from '~app/collection/detail/core/components/image-selector/image-selector.component';

import { TomeForm } from '../../models/tome-form';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    ImageSelectorComponent,
  ],
  selector: 'col-tome-dialog',
  templateUrl: './tome-dialog.component.html',
  styleUrls: ['./tome-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TomeDialogComponent {
  form: TomeForm;
  title: string;
  id: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: { tome: TomeForm; title: string; id: string }) {
    this.form = data.tome;
    this.id = data.id;
    this.title = data.title;
  }
}
