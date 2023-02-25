import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'net-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'netatmo';

  constructor(private oauthService: OAuthService) {}

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
