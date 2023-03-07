import { ModuleWithRoom } from './module-with-room';
import { MeasureType } from '../api/enums/measure-type';

export interface ModuleWithEnabledMeasureTypes extends ModuleWithRoom {
  enabledMeasureTypes: MeasureType[];
}
