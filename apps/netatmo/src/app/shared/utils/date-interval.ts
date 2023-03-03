import { Interval } from '../enums/interval';

export function getInterval(interval: Interval) {
  let begin, end;

  switch (interval) {
    case Interval.Year: {
      const currentYear = new Date().getFullYear();
      begin = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      end = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      return { begin, end, scale: '1week' };
    }

    case Interval.Month: {
      const now = new Date();
      begin = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      return { begin, end, scale: '1day' };
    }

    case Interval.Week: {
      const today = new Date();
      const weekStartsOn = 1;
      const day = today.getDay();
      const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
      begin = new Date(today.setDate(today.getDate() - diff));
      begin.setHours(0, 0, 0, 0);

      end = new Date(today.setDate(today.getDate() + 6));
      end.setHours(23, 59, 59, 999);

      return { begin, end, scale: '3hours' };
    }

    case Interval.Day:
    default:
      begin = new Date();
      begin.setHours(0, 0, 0, 0);

      end = new Date();
      end.setHours(23, 59, 59, 999);

      return { begin, end, scale: '30min' };
  }
}
