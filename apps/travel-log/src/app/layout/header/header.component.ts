import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  constructor(private store: Store) {}

  toggleSidenav(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }
}
