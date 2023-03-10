import { ModuleWithMeasureTypes } from './module-with-measure-types';
import { MeasureType } from '../api/enums/measure-type';

export interface ModuleWithEnabledMeasureTypes extends ModuleWithMeasureTypes {
  enabledMeasureTypes: MeasureType[];
}
