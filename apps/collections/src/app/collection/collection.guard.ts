import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';

@Injectable({
  providedIn: 'root',
})
export class CollectionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const collection = route.paramMap.get('collection') as Collection;
    return Object.keys(metas).includes(collection) || this.router.parseUrl('/error');
  }
}
