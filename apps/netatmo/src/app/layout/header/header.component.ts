import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';

import { layoutActions } from '../store/layout.actions';

@Component({
  selector: 'net-header',
  standalone: true,
  imports: [NgIf, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private store: Store, private oauthService: OAuthService) {}

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  toggleSidenav(): void {
    this.store.dispatch(layoutActions.toggleSidenav());
  }
}
