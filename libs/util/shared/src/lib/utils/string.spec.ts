import { removeDiacritics, removeSpaces, toPredicate } from './string';

describe('string utils', () => {
  describe('removeDiacritics', () => {
    it('should remove removeDiacritics', () => {
      expect(removeDiacritics('áéíóú')).toEqual('aeiou');
    });
  });

  describe('removeSpaces', () => {
    it('should remove spaces', () => {
      expect(removeSpaces(' a b c ')).toEqual('abc');
    });
  });

  describe('toPredicate', () => {
    it('should remove diacritics and spaces', () => {
      expect(toPredicate(' á é í ó ú ')).toEqual('aeiou');
    });
  });
});
