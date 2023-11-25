import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { layoutActions } from '../../layout.actions';
import { layoutFeature } from '../../layout.feature';
import { ToolbarConfig } from '../../layout.models';

@Component({
  selector: 'col-toolbar',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgForOf, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  config$: Observable<ToolbarConfig> = this.store.select(layoutFeature.selectToolbarConfig);

  constructor(private store: Store) {}

  toggleSidenav(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }

  clickOnAction(action: Action): void {
    this.store.dispatch(action);
  }
}
