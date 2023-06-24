import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { layoutActions } from '../../layout.actions';
import { ToolbarConfig } from '../../layout.models';
import * as layoutSelectors from '../../layout.selectors';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule],
  selector: 'col-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  config$: Observable<ToolbarConfig> = this.store.select(layoutSelectors.selectToolbarConfig);

  constructor(private store: Store) {}

  toggleSidenav(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }

  clickOnAction(action: Action): void {
    this.store.dispatch(action);
  }
}
