import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { HeaderComponent } from './header.component';
import { layoutFeature } from '../layout.feature';

describe('HeaderComponent', () => {
  let fixture: MockedComponentFixture<HeaderComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(HeaderComponent).provide(
      provideMockStore({
        selectors: [{ selector: layoutFeature.selectShowSearchBar, value: false }],
      })
    );

    fixture = MockRender(HeaderComponent);

    store = ngMocks.findInstance(MockStore);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display toolbar', () => {
    expect(ngMocks.find('col-toolbar')).not.toBeNull();
    expect(ngMocks.find('col-search-bar', null)).toBeNull();
  });

  it('should display search bar', () => {
    layoutFeature.selectShowSearchBar.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    expect(ngMocks.find('col-toolbar', null)).toBeNull();
    expect(ngMocks.find('col-search-bar')).not.toBeNull();
  });
});
