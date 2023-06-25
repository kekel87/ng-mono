import { tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, NG_MOCKS_ROOT_PROVIDERS, ngMocks } from 'ng-mocks';

import { layoutActions } from '~app/core/layout/layout.actions';

import { SearchBarComponent } from './search-bar.component';
import * as layoutSelectors from '../../layout.selectors';

describe('SearchBarComponent', () => {
  let fixture: MockedComponentFixture<SearchBarComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(SearchBarComponent)
      .keep(FormsModule)
      .keep(NG_MOCKS_ROOT_PROVIDERS)
      .provide(
        provideMockStore({
          selectors: [{ selector: layoutSelectors.selectSearchPredicate, value: null }],
        })
      );

    fixture = MockRender(SearchBarComponent);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should dispatch search action', fakeAsync(() => {
    ngMocks.output('input', 'ngModelChange').emit('toto');
    fixture.detectChanges();
    tick(200);

    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.search({ search: 'toto' }));
  }));

  it('should restore previous search', () => {
    layoutSelectors.selectSearchPredicate.setResult('pokemon');
    store.refreshState();
    fixture.detectChanges();

    expect(ngMocks.findInstance(ngMocks.find('input'), NgModel).model).toBe('pokemon');
  });

  it('should dispatch close action', () => {
    ngMocks.click('button');
    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.closeSearchBar());
  });
});
