import { getElementAt } from './array';

describe('array utils', () => {
  describe('getElementAt', () => {
    it('should element at index', () => {
      expect(getElementAt([1], 0)).toBe(1);
    });

    it('should return last element if index is out off array', () => {
      expect(getElementAt([1], 3)).toBe(1);
    });
  });
});
