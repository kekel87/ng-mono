import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { LoaderComponent } from '~shared/components/loader/loader.component';

describe('LoaderComponent', () => {
  let fixture: MockedComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await MockBuilder(LoaderComponent);

    fixture = MockRender(LoaderComponent);
  });

  it('should create', () => {
    expect(fixture).not.toBeNull();
  });
});
