import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let fixture: MockedComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await MockBuilder(ErrorComponent);

    fixture = MockRender(ErrorComponent);
  });

  it('should create', () => {
    expect(fixture).not.toBeNull();
  });
});
