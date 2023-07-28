import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { RuntimeConfig } from '~shared/models/runtime-config';

import { authActions } from '../auth.actions';
import { authFeature } from '../auth.reducer';
import * as authSelectors from '../auth.selectors';

@Component({
  selector: 'col-login',
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
    this.loading$ = this.store.select(authSelectors.selectLoading);
    this.displayLoginField = isQa;
  }

  ngOnInit(): void {
    this.store
      .select(authSelectors.selectUser)
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

@NgModule({
  imports: [CommonModule, FormsModule, StoreModule.forFeature(authFeature), MatButtonModule, LoaderComponent],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {}
