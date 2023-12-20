// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

import 'jest-preset-angular/setup-jest';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ngMocks } from 'ng-mocks';

ngMocks.autoSpy('jest');
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalReplace(BrowserAnimationsModule, NoopAnimationsModule);

jest.mock('uuid', () => ({ v4: () => 'uuid' }));
