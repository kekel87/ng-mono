import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { delay, first, map } from 'rxjs/operators';

import { layoutActions } from '../store/layout.actions';
import { layoutFeature } from '../store/layout.reducer';

@Component({
  selector: 'net-sidenav',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  open$: Observable<boolean> = this.store.select(layoutFeature.selectOpenedSidenav);

  isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((state: BreakpointState) => state.matches));

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isMobile$.pipe(first(), delay(200)).subscribe((isMobile) => this.store.dispatch(layoutActions.setSidenav({ opened: !isMobile })));
  }

  close(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }

  startAnimated(): void {
    this.store.dispatch(layoutActions.sidenavStartAnimated());
  }

  endAnimated(): void {
    this.store.dispatch(layoutActions.sidenavEndAnimated());
  }
}
