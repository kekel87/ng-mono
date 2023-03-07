import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';

import { homeActions } from '../../shared/stores/home/home.actions';
import { homeFeature } from '../../shared/stores/home/home.reducer';
import { layoutActions } from '../store/layout.actions';

@Component({
  selector: 'net-header',
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe, MatToolbarModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  homes$ = this.store.select(homeFeature.selectAll);
  selectedHome$ = this.store.select(homeFeature.selectSelected);

  constructor(private store: Store, private oauthService: OAuthService) {}

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  toggleSidenav(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }

  selectHome(id: string): void {
    this.store.dispatch(homeActions.select({ id }));
  }
}
