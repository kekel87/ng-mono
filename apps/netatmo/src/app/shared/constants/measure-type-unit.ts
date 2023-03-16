import { MeasureType } from '../api/enums/measure-type';

export const MEASURE_TYPE_UNIT: Record<MeasureType, string> = {
  [MeasureType.SumBoilerOn]: '%',
  [MeasureType.Temperature]: '°C',
  [MeasureType.Humidity]: '%',
  [MeasureType.CO2]: 'ppm',
  [MeasureType.Noise]: 'db',
  [MeasureType.Pressure]: 'mb',
  [MeasureType.Rain]: '-',
  [MeasureType.WindStrength]: '-',
};
