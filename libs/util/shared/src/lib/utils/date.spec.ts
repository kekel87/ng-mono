import { isoStringToUnixTimestamp } from './date';

describe('date utils', () => {
  describe('isoStringToUnixTimestamp', () => {
    it('should return timestemps from iso string', () => {
      expect(isoStringToUnixTimestamp('1989-08-31T22:30:00.000Z')).toEqual(620605800);
    });
  });
});
