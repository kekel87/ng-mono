import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export function fromToValidator(control: AbstractControl): ValidationErrors | null {
  const from = control.get('from')?.value;
  const to = control.get('to')?.value;

  return from < 1 || from >= to ? { rangeError: true } : null;
}

@Component({
  selector: 'col-confirm-dialog',
  templateUrl: './create-tomes-dialog.component.html',
  styleUrls: ['./create-tomes-dialog.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatIconModule,
  ],
})
export class CreateTomesDialogComponent {
  form: FormGroup<{
    from: FormControl<number>;
    to: FormControl<number>;
  }>;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: { start: number }
  ) {
    this.form = this.formBuilder.nonNullable.group(
      {
        from: [data.start],
        to: [data.start + 1],
      },
      { validators: fromToValidator }
    );
  }
}
