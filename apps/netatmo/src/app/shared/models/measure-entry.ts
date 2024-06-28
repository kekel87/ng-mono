import { MeasureType } from '../api/enums/measure-type';

export interface MeasureEntry extends Partial<Record<MeasureType, number>> {
  id: string;
  timestamp: string;
}
