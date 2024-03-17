import type { MatcherFunction } from 'expect';
import { MockedDebugElement, ngMocks } from 'ng-mocks';

export const toHaveText: MatcherFunction<[expected: string]> = (actual: unknown, expected: string) => {
  const text = ngMocks.formatText(typeof actual === 'string' ? ngMocks.find(actual) : (actual as MockedDebugElement));
  const pass = text.includes(expected);
  return {
    pass,
    message: pass ? () => `Expected ${text} not contain ${expected}` : () => `Expected ${text} contain ${expected}`,
  };
};
