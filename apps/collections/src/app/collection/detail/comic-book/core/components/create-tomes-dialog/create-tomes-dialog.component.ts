import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

export function fromToValidator(control: AbstractControl): ValidationErrors | null {
  const from = control.get('from')?.value;
  const to = control.get('to')?.value;

  return from < 1 || from >= to ? { rangeError: true } : null;
}

@Component({
  selector: 'col-confirm-dialog',
  templateUrl: './create-tomes-dialog.component.html',
  styleUrls: ['./create-tomes-dialog.component.scss'],
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
