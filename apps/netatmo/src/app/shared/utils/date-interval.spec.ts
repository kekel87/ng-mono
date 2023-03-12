import { asNext, build, next, previous } from './date-interval';
import { IntervalType } from '../enums/interval-type';

describe('Date interval utils', () => {
  const date = new Date('2023-03-11T11:00:00.000Z');

  describe('build', () => {
    it('should return day interval', () => {
      expect(build(IntervalType.Day, date)).toEqual({
        begin: '2023-03-10T23:00:00.000Z',
        end: '2023-03-11T22:59:59.999Z',
        scale: '30min',
        type: IntervalType.Day,
      });
    });

    it('should return week interval', () => {
      expect(build(IntervalType.Week, date)).toEqual({
        begin: '2023-03-05T23:00:00.000Z',
        end: '2023-03-12T22:59:59.999Z',
        scale: '3hours',
        type: IntervalType.Week,
      });
    });

    it('should return month interval', () => {
      expect(build(IntervalType.Month, date)).toEqual({
        begin: '2023-02-28T23:00:00.000Z',
        end: '2023-03-31T21:59:59.999Z',
        scale: '1day',
        type: IntervalType.Month,
      });
    });

    it('should return year interval', () => {
      expect(build(IntervalType.Year, date)).toEqual({
        begin: '2022-12-31T23:00:00.000Z',
        end: '2023-12-31T22:59:59.999Z',
        scale: '1week',
        type: IntervalType.Year,
      });
    });
  });

  describe('asNext', () => {
    beforeEach(() => jest.useFakeTimers());

    afterEach(() => jest.useRealTimers());

    it('should return true if day interval as next values', () => {
      jest.setSystemTime(new Date('2023-03-12T11:00:00.000Z'));

      const interval = build(IntervalType.Day, date);
      expect(asNext(interval)).toBe(true);
    });

    it('should return false if day interval as no next values', () => {
      jest.setSystemTime(date);

      const interval = build(IntervalType.Day, date);
      expect(asNext(interval)).toBe(false);
    });

    it('should return true if week interval as next values', () => {
      jest.setSystemTime(new Date('2023-03-18T11:00:00.000Z'));

      const interval = build(IntervalType.Week, date);
      expect(asNext(interval)).toBe(true);
    });

    it('should return false if week interval as no next values', () => {
      jest.setSystemTime(date);

      const interval = build(IntervalType.Week, date);
      expect(asNext(interval)).toBe(false);
    });

    it('should return true if month interval as next values', () => {
      jest.setSystemTime(new Date('2023-04-11T11:00:00.000Z'));

      const interval = build(IntervalType.Month, date);
      expect(asNext(interval)).toBe(true);
    });

    it('should return false if month interval as no next values', () => {
      jest.setSystemTime(date);

      const interval = build(IntervalType.Month, date);
      expect(asNext(interval)).toBe(false);
    });

    it('should return true if year interval as next values', () => {
      jest.setSystemTime(new Date('2024-12-11T11:00:00.000Z'));

      const interval = build(IntervalType.Year, date);
      expect(asNext(interval)).toBe(true);
    });

    it('should return false if year interval as no next values', () => {
      jest.setSystemTime(date);

      const interval = build(IntervalType.Year, date);
      expect(asNext(interval)).toBe(false);
    });
  });

  describe('next', () => {
    it('should return next day interval', () => {
      expect(next(build(IntervalType.Day, date))).toEqual({
        begin: '2023-03-11T23:00:00.000Z',
        end: '2023-03-12T22:59:59.999Z',
        scale: '30min',
        type: IntervalType.Day,
      });
    });

    it('should return next week interval', () => {
      expect(next(build(IntervalType.Week, date))).toEqual({
        begin: '2023-03-12T23:00:00.000Z',
        end: '2023-03-19T22:59:59.999Z',
        scale: '3hours',
        type: IntervalType.Week,
      });
    });

    it('should return next month interval', () => {
      expect(next(build(IntervalType.Month, date))).toEqual({
        begin: '2023-03-31T22:00:00.000Z',
        end: '2023-04-30T21:59:59.999Z',
        scale: '1day',
        type: IntervalType.Month,
      });
    });

    it('should return next year interval', () => {
      expect(next(build(IntervalType.Year, date))).toEqual({
        begin: '2023-12-31T23:00:00.000Z',
        end: '2024-12-31T22:59:59.999Z',
        scale: '1week',
        type: IntervalType.Year,
      });
    });
  });

  describe('previous', () => {
    it('should return previous day interval', () => {
      expect(previous(build(IntervalType.Day, date))).toEqual({
        begin: '2023-03-09T23:00:00.000Z',
        end: '2023-03-10T22:59:59.999Z',
        scale: '30min',
        type: IntervalType.Day,
      });
    });

    it('should return previous week interval', () => {
      expect(previous(build(IntervalType.Week, date))).toEqual({
        begin: '2023-02-26T23:00:00.000Z',
        end: '2023-03-05T22:59:59.999Z',
        scale: '3hours',
        type: IntervalType.Week,
      });
    });

    it('should return previous month interval', () => {
      expect(previous(build(IntervalType.Month, date))).toEqual({
        begin: '2023-01-31T23:00:00.000Z',
        end: '2023-02-28T22:59:59.999Z',
        scale: '1day',
        type: IntervalType.Month,
      });
    });

    it('should return previous year interval', () => {
      expect(previous(build(IntervalType.Year, date))).toEqual({
        begin: '2021-12-31T23:00:00.000Z',
        end: '2022-12-31T22:59:59.999Z',
        scale: '1week',
        type: IntervalType.Year,
      });
    });
  });
});
