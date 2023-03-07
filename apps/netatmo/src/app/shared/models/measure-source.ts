import { MeasureType } from '../api/enums/measure-type';

export interface MeasureSource extends Partial<Record<MeasureType, number>> {
  id: string;
  timestamp: string;
}
