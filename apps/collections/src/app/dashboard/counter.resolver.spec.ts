import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { cold } from 'jasmine-marbles';
import { MockBuilder } from 'ng-mocks';
import { of } from 'rxjs';

import { Collection } from '~shared/enums/collection';
import { SupabaseHelperService } from '~shared/services/supabase-helper.service';
import { MockCounter } from '~tests/mocks/counter';

import { counterResolver } from './counter.resolver';

describe('counterResolver', () => {
  const activatedRouteSnapshot = new ActivatedRouteSnapshot();
  const routerStateSnapshot = {} as RouterStateSnapshot;

  const supabaseService = { count: jest.fn() };

  beforeEach(async () => {
    await MockBuilder().mock(SupabaseHelperService, supabaseService);
  });

  it('should return counter', () => {
    supabaseService.count.mockImplementation((collection: Collection) => of(MockCounter.base[collection]));

    expect(TestBed.runInInjectionContext(() => counterResolver(activatedRouteSnapshot, routerStateSnapshot))).toBeObservable(
      cold('(a|)', { a: MockCounter.base })
    );
    expect(supabaseService.count).toHaveBeenCalledTimes(4);
    expect(supabaseService.count).toHaveBeenCalledWith(Collection.Amiibos);
    expect(supabaseService.count).toHaveBeenCalledWith(Collection.Books);
    expect(supabaseService.count).toHaveBeenCalledWith(Collection.Games);
    expect(supabaseService.count).toHaveBeenCalledWith(Collection.Vinyles);
  });
});
