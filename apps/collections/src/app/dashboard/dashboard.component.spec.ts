import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { MockCounter } from '~tests/mocks/counter';

import { DashboardComponent } from './dashboard.component';
import { counterFeature } from './store/counter/counter.feature';

describe('DashboardComponent', () => {
  let fixture: MockedComponentFixture<DashboardComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(DashboardComponent).provide(
      provideMockStore({
        selectors: [
          { selector: counterFeature.selectIsLoading, value: true },
          {
            selector: counterFeature.selectEntities,
            value: MockCounter.all.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
          },
        ],
      })
    );

    fixture = MockRender(DashboardComponent);
    store = ngMocks.findInstance(MockStore);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display game loader', () => {
    expect(ngMocks.find('col-loader')).not.toBeNull();
  });

  it('should hide game loader', () => {
    counterFeature.selectIsLoading.setResult(false);
    store.refreshState();
    fixture.detectChanges();

    expect(ngMocks.find('col-loader', null)).toBeNull();
  });

  it('should display number of items', () => {
    expect(ngMocks.findAll('mat-card-subtitle').map((el) => ngMocks.formatText(el))).toEqual(['2', '0', '4', '6', '1']);
  });
});
