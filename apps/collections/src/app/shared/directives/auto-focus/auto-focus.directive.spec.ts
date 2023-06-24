import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { AutoFocusDirective } from './auto-focus.directive';

describe('Directive: AutoFocus', () => {
  let fixture: MockedComponentFixture<void>;

  beforeEach(async () => {
    await MockBuilder(AutoFocusDirective);

    fixture = MockRender(`<input type="text" colAutofocus />`);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });
});
