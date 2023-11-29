import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';

import { metas } from '~shared/consts/metas';
import { Collection } from '~shared/enums/collection';

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const collection = route.paramMap.get('collection') as Collection;
  return Object.keys(metas).includes(collection) || router.parseUrl('/error');
};
