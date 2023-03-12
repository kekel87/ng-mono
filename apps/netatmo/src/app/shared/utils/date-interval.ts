import { IntervalType } from '../enums/interval-type';
import { Interval } from '../models/interval';

export function build(interval: IntervalType, dateBase = new Date()): Interval {
  let begin, end, scale;

  switch (interval) {
    case IntervalType.Year: {
      const currentYear = dateBase.getFullYear();
      begin = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      end = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      scale = '1week';
      break;
    }

    case IntervalType.Month: {
      begin = new Date(dateBase.getFullYear(), dateBase.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(dateBase.getFullYear(), dateBase.getMonth() + 1, 0, 23, 59, 59, 999);
      scale = '1day';

      break;
    }

    case IntervalType.Week: {
      const weekStartsOn = 1;
      const day = dateBase.getDay();
      const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

      begin = new Date(dateBase);
      begin.setDate(begin.getDate() - diff);
      begin.setHours(0, 0, 0, 0);

      end = new Date(begin);
      end.setDate(begin.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      scale = '3hours';
      break;
    }

    case IntervalType.Day:
    default:
      begin = new Date(dateBase);
      begin.setHours(0, 0, 0, 0);

      end = new Date(dateBase);
      end.setHours(23, 59, 59, 999);

      scale = '30min';
      break;
  }

  return {
    type: interval,
    begin: begin.toISOString(),
    end: end.toISOString(),
    scale,
  };
}

export function asNext(interval: Interval): boolean {
  return new Date() > new Date(interval.end);
}

function nextPrevious(interval: Interval, multiplier = 1) {
  const begin = new Date(interval.begin),
    end = new Date(interval.end);

  switch (interval.type) {
    case IntervalType.Year: {
      begin.setFullYear(begin.getFullYear() + 1 * multiplier);
      end.setFullYear(end.getFullYear() + 1 * multiplier);
      break;
    }

    case IntervalType.Month: {
      begin.setMonth(begin.getMonth() + 1 * multiplier, 1);
      end.setMonth(end.getMonth() + 1 * multiplier + 1, 0);
      break;
    }

    case IntervalType.Week: {
      begin.setDate(begin.getDate() + 7 * multiplier);
      end.setDate(end.getDate() + 7 * multiplier);
      break;
    }

    case IntervalType.Day:
    default:
      begin.setDate(begin.getDate() + 1 * multiplier);
      end.setDate(end.getDate() + 1 * multiplier);
      break;
  }

  return { ...interval, begin: begin.toISOString(), end: end.toISOString() };
}

export function next(interval: Interval) {
  return nextPrevious(interval);
}

export function previous(interval: Interval) {
  return nextPrevious(interval, -1);
}
