import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Store } from '@ngrx/store';

import { FullPageLoaderComponent } from '@ng-mono/shared/ui';

import { authActions } from '../../store/auth.actions';
import { authFeature } from '../../store/auth.feature';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButton, MatFormField, MatInput, FullPageLoaderComponent, MatLabel],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected formGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected loading = toSignal(this.store.select(authFeature.selectLoading));

  constructor(
    private store: Store,
    private fb: NonNullableFormBuilder
  ) {}

  signInWithGoogle(): void {
    this.store.dispatch(authActions.googleLogin());
  }

  signInWithEmailAndPassword(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.store.dispatch(authActions.emailPasswordLogin(this.formGroup.getRawValue()));
  }
}
