import type { MatcherFunction } from 'expect';
import { MockedDebugElement, ngMocks } from 'ng-mocks';

export const toHaveText: MatcherFunction<[expected: string]> = function(actual: unknown, expected: string) {
  const received = ngMocks.formatText(typeof actual === 'string' ? ngMocks.find(actual) : (actual as MockedDebugElement));
  const pass = received.includes(expected);
  const message = `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}`;
  return {
    pass,
    message: pass ? () => message : () => `${message}\n\n${this.utils.diff(expected, received)}`,
  };
};
