import { MeasureType } from '../api/enums/measure-type';

export const MEASURE_TYPE_ICONS: Record<MeasureType, string> = {
  [MeasureType.SumBoilerOn]: 'local_fire_department',
  [MeasureType.Temperature]: 'thermostat',
  [MeasureType.Humidity]: 'water_drop',
  [MeasureType.CO2]: 'co2',
  [MeasureType.Noise]: 'mic',
  [MeasureType.Pressure]: 'compress',
  [MeasureType.Rain]: 'water_drop',
  [MeasureType.WindStrength]: 'wind_power',
};
