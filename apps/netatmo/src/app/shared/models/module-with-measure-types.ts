import { ModuleWithRoom } from './module-with-room';
import { MeasureType } from '../api/enums/measure-type';

export interface ModuleWithMeasureTypes extends ModuleWithRoom {
  measureType: MeasureType[];
  measureTypeColors: Partial<Record<MeasureType, string>>;
}
