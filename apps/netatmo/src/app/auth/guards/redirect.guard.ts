import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RedirectGuard {
  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivate(): Observable<UrlTree> {
    return from(this.oauthService.tryLogin()).pipe(map(() => this.router.createUrlTree([])));
  }
}
