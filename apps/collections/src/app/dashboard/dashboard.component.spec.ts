import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { LinkState } from '~shared/enums/link-state';
import { MockCounter } from '~tests/mocks/counter';

import { DashboardComponent } from './dashboard.component';
import { DashboardModule } from './dashboard.module';
import * as counterSelectors from './store/counter/counter.selectors';

describe('DashboardComponent', () => {
  let fixture: MockedComponentFixture<DashboardComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await MockBuilder(DashboardComponent, DashboardModule).provide(
      provideMockStore({
        initialState: { dashboard: { counter: { ids: [], entities: [] } } },
        selectors: [{ selector: counterSelectors.selectIsLoading, value: true }],
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
    counterSelectors.selectIsLoading.setResult(false);
    store.refreshState();
    fixture.detectChanges();

    expect(ngMocks.find('col-loader', null)).toBeNull();
  });

  it('should display number of items', () => {
    store.setState({
      dashboard: {
        counter: {
          ids: MockCounter.all.map(({ id }) => id),
          entities: MockCounter.all.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
          linkState: LinkState.Linked,
        },
      },
    });
    fixture.detectChanges();

    expect(ngMocks.findAll('mat-card-subtitle').map((el) => ngMocks.formatText(el))).toEqual(['2', '0', '4', '6', '1']);
  });
});
