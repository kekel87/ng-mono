import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { RuntimeConfig } from '~shared/models/runtime-config';

import { authActions } from '../auth.actions';
import { authFeature } from '../auth.feature';

@Component({
  selector: 'col-login',
  standalone: true,
  imports: [AsyncPipe, NgIf, FormsModule, MatButtonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  loading$: Observable<boolean>;

  protected readonly displayLoginField: boolean;

  constructor(
    private store: Store,
    @Inject(RUNTIME_CONFIG) { isQa }: RuntimeConfig
  ) {
    this.loading$ = this.store.select(authFeature.selectLoading);
    this.displayLoginField = isQa;
  }

  ngOnInit(): void {
    // TODO this should be a guard
    this.store
      .select(authFeature.selectUser)
      .pipe(
        first(),
        filter((user) => !!user)
      )
      .subscribe(() => {
        this.store.dispatch(authActions.redirect());
      });
  }

  signInWithGoogle(): void {
    this.store.dispatch(authActions.googleLogin());
  }

  signInWithEmailAndPassword(email: string, password: string): void {
    this.store.dispatch(authActions.emailPasswordLogin({ email, password }));
  }
}
