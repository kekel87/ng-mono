import { original } from './order';

describe('Order utils', () => {
  describe('merge', () => {
    it('should always return 0', () => {
      expect(original({ key: 'id', value: 2 }, { key: 'id', value: 1 })).toEqual(0);
    });
  });
});
