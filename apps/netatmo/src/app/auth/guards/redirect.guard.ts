import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivate(): Observable<UrlTree> {
    return from(this.oauthService.tryLogin()).pipe(map(() => this.router.createUrlTree([])));
  }
}
