import { IntervalType } from '../enums/interval-type';
import { Interval } from '../models/interval';

export function getInterval(interval: IntervalType): Interval {
  let begin, end, scale;

  switch (interval) {
    case IntervalType.Year: {
      const currentYear = new Date().getFullYear();
      begin = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      end = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      scale = '1week';
      break;
    }

    case IntervalType.Month: {
      const now = new Date();
      begin = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      scale = '1day';

      break;
    }

    case IntervalType.Week: {
      const today = new Date();
      const weekStartsOn = 1;
      const day = today.getDay();
      const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
      begin = new Date(today.setDate(today.getDate() - diff));
      begin.setHours(0, 0, 0, 0);

      end = new Date(today.setDate(today.getDate() + 6));
      end.setHours(23, 59, 59, 999);

      scale = '3hours';
      break;
    }

    case IntervalType.Day:
    default:
      begin = new Date();
      begin.setHours(0, 0, 0, 0);

      end = new Date();
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
