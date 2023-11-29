import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { Collection } from '~shared/enums/collection';

import { canActivate } from './collection.guard';

describe('Collection guards', () => {
  let activatedRouteSnapshot: ActivatedRouteSnapshot;
  const routerStateSnapshot = {} as RouterStateSnapshot;

  beforeEach(async () => {
    await MockBuilder().provide(provideRouter([]));

    activatedRouteSnapshot = new ActivatedRouteSnapshot();
  });

  it('should activate handle collection', () => {
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue(Collection.Games);

    expect(TestBed.runInInjectionContext(() => canActivate(activatedRouteSnapshot, routerStateSnapshot))).toEqual(true);
  });

  it('should redirect with not handle collection', () => {
    const router = ngMocks.findInstance(Router);
    const urlTree = {} as UrlTree;
    jest.spyOn(router, 'parseUrl').mockReturnValue(urlTree);
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue('bite');

    expect(TestBed.runInInjectionContext(() => canActivate(activatedRouteSnapshot, routerStateSnapshot))).toEqual(urlTree);
    expect(router.parseUrl).toHaveBeenLastCalledWith('/error');
  });
});
