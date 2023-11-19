import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { authActions } from '~app/auth/auth.actions';
import * as authSelectors from '~app/auth/auth.selectors';
import { User } from '~app/auth/user.model';
import { metas } from '~shared/consts/metas';
import { RouteName } from '~shared/enums/route-name';
import { OrderUtils } from '~shared/utils/order';

import { layoutActions } from '../layout.actions';
import { SnackbarOptions } from '../layout.models';
import * as layoutSelectors from '../layout.selectors';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatInputModule,
  ],
  selector: 'col-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.scss', './sidepanel.component-theme.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent {
  open$: Observable<boolean> = this.store.select(layoutSelectors.selectShowSidenav);
  user$: Observable<User | null> = this.store.select(authSelectors.selectUser);
  isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((state: BreakpointState) => state.matches));

  readonly routeName = RouteName;
  readonly metas = metas;
  readonly originalOrder = OrderUtils.original;

  constructor(
    private store: Store,
    private action$: ActionsSubject,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.action$.pipe(ofType(layoutActions.openSnackbar)).subscribe(({ options }) => this.openSnackbar(options));
  }

  openSnackbar({ message, action, config, onAction }: SnackbarOptions): void {
    const snackBarRef = this.snackBar.open(message, action, config);

    if (onAction) {
      snackBarRef
        .onAction()
        .pipe(first())
        .subscribe(() => {
          this.store.dispatch(onAction);
        });
    }
  }

  logout(): void {
    this.store.dispatch(authActions.logout());
  }

  close(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }
}
