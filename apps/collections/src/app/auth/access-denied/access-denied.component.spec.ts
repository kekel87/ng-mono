import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { AccessDeniedComponent, AccessDeniedModule } from './access-denied.component';

describe('AccessDeniedComponent', () => {
  let fixture: MockedComponentFixture<AccessDeniedComponent>;

  beforeEach(async () => {
    await MockBuilder(AccessDeniedComponent, AccessDeniedModule);

    fixture = MockRender(AccessDeniedComponent);
  });

  it('should create', () => {
    expect(fixture).not.toBeNull();
  });
});
