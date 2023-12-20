import { ActivatedRoute } from '@angular/router';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { MockCounter } from '~tests/mocks/counter';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: MockedComponentFixture<DashboardComponent>;
  const activatedRoute = { data: of({ counter: MockCounter.base }) };

  beforeEach(async () => {
    await MockBuilder(DashboardComponent).provide({ provide: ActivatedRoute, useValue: activatedRoute });

    fixture = MockRender(DashboardComponent);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display number of items', () => {
    expect(ngMocks.findAll('mat-card-subtitle').map((el) => ngMocks.formatText(el))).toEqual(['2', '4', '6', '1']);
  });
});
