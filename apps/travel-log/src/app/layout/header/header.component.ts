import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { authActions, authFeature, User } from '@ng-mono/auth';
import { Store } from '@ngrx/store';

import { layoutActions } from '../store/layout.actions';

@Component({
  selector: 'log-header',
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe, MatToolbarModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected readonly user: Signal<User | null | undefined> = toSignal(this.store.select(authFeature.selectUser));

  constructor(private store: Store) {}

  protected toggleSidenav(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }

  protected logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
