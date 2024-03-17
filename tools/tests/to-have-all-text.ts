import type { MatcherFunction } from 'expect';
import { MockedDebugElement, ngMocks } from 'ng-mocks';

export const toHaveAllText: MatcherFunction<[expected: string[]]> = function(actual: unknown, expected: string[]) {
  const received = (typeof actual === 'string' ? ngMocks.findAll(actual) : (actual as MockedDebugElement[])).map((d) => ngMocks.formatText(d));
  const pass = received.every((r, i) => !!expected[i] && r.includes(expected[i]));
  const message = `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}`;
  return {
    pass,
    message: pass ? () => message : () => `${message}\n\n${this.utils.diff(expected, received)}`,
  };
};
