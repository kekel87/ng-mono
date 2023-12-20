import { FormControl, FormGroup } from '@angular/forms';

export type TomeForm = FormGroup<{
  number: FormControl<number>;
  acquired: FormControl<boolean>;
  image: FormControl<string | null>;
}>;
