import { hasValue, isRecord, isEmpty } from './type-guards';

describe('Type Guard utils', () => {
  describe('hasValue', () => {
    it('should return true', () => {
      expect(hasValue(12)).toBe(true);
      expect(hasValue(0)).toBe(true);
      expect(hasValue(true)).toBe(true);
      expect(hasValue(false)).toBe(true);
      expect(hasValue('test')).toBe(true);
      expect(hasValue('')).toBe(true);
    });

    it('should return false', () => {
      expect(hasValue(null)).toBe(false);
      expect(hasValue(undefined)).toBe(false);
    });
  });

  describe('isRecord', () => {
    it('should return true', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ key: 0 })).toBe(true);
      expect(isRecord(new Date())).toBe(true);
    });

    it('should return false', () => {
      expect(isRecord(null)).toBe(false);
      expect(isRecord(undefined)).toBe(false);
      expect(isRecord(1)).toBe(false);
      expect(isRecord(true)).toBe(false);
      expect(isRecord([])).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty(' ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false', () => {
      expect(isEmpty(12)).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty({ toto: 'tata' })).toBe(false);
      expect(isEmpty(['test'])).toBe(false);
    });
  });
});
