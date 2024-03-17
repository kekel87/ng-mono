import type { MatcherFunction } from 'expect';
import { MockedDebugElement, ngMocks } from 'ng-mocks';

export const toHaveAllText: MatcherFunction<[expected: string[]]> = (actual: unknown, expected: string[]) => {
  const pass = (typeof actual === 'string' ? ngMocks.findAll(actual) : (actual as MockedDebugElement[])).every((d, i) => ngMocks.formatText(d).includes(expected[i]));
  return {
    pass,
    message: pass ? () => `Expected all elements not contain [${expected.join(', ')}]` : () => `Expected all elements contain [${expected.join(', ')}]`,
  };
};
