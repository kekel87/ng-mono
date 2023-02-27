import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  standalone: true,
  imports: [RouterOutlet, NgIf, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule],
  selector: 'net-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private oauthService: OAuthService) {}

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
