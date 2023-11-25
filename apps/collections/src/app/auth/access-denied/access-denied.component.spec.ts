import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { AccessDeniedComponent } from './access-denied.component';

describe('AccessDeniedComponent', () => {
  let fixture: MockedComponentFixture<AccessDeniedComponent>;

  beforeEach(async () => {
    await MockBuilder(AccessDeniedComponent);

    fixture = MockRender(AccessDeniedComponent);
  });

  it('should create', () => {
    expect(fixture).not.toBeNull();
  });
});
