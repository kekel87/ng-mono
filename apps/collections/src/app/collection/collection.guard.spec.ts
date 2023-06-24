import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { Collection } from '~shared/enums/collection';

import { CollectionGuard } from './collection.guard';

describe('AuthGuard', () => {
  let guard: CollectionGuard;
  let activatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(async () => {
    await MockBuilder(CollectionGuard).keep(RouterTestingModule.withRoutes([]));

    guard = ngMocks.findInstance(CollectionGuard);
    activatedRouteSnapshot = new ActivatedRouteSnapshot();
  });

  it('should activate handle collection', () => {
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue(Collection.Games);
    expect(guard.canActivate(activatedRouteSnapshot)).toEqual(true);
  });

  it('should redirect with not handle collection', () => {
    jest.spyOn(activatedRouteSnapshot.paramMap, 'get').mockReturnValue('bite');
    expect(guard.canActivate(activatedRouteSnapshot).toString()).toEqual('/error');
  });
});
