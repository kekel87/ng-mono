import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { FullPageLoaderComponent } from './full-page-loader.component';

describe('FullPageLoaderComponent', () => {
  let fixture: MockedComponentFixture<FullPageLoaderComponent>;

  beforeEach(async () => {
    await MockBuilder(FullPageLoaderComponent);

    fixture = MockRender(FullPageLoaderComponent);
  });

  it('should create', () => {
    expect(fixture).not.toBeNull();
  });
});
