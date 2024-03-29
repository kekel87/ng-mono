import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class IsLoggedGuard {
  constructor(private oauthService: OAuthService) {}

  canActivate(): boolean | UrlTree {
    if (this.oauthService.hasValidAccessToken()) {
      return true;
    }

    this.oauthService.initCodeFlow();
    return false;
  }
}
