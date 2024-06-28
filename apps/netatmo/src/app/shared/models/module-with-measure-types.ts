import { ModuleWithRoom } from './module-with-room';
import { MeasureType } from '../api/enums/measure-type';
import { MeasureSource } from '../enums/mesure-source';

export interface ModuleWithMeasureTypes extends ModuleWithRoom {
  measureSource: MeasureSource;
  measureType: MeasureType[];
  measureTypeColors: Partial<Record<MeasureType, string>>;
}
