import { IntervalType } from '../enums/interval-type';

export interface Interval {
  type: IntervalType;
  begin: string;
  end: string;
  scale: string;
}
