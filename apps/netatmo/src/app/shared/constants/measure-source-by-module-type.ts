import { ModuleType } from '../api/enums/module-type';
import { MeasureSource } from '../enums/mesure-source';

export const MEASURE_SOURCE_BY_MODULE_TYPE: Record<ModuleType, MeasureSource> = {
  [ModuleType.WeatherStation]: MeasureSource.Measure,
  [ModuleType.OutdoorModule]: MeasureSource.Measure,
  [ModuleType.IndoorModule]: MeasureSource.Measure,
  [ModuleType.AnemometerModule]: MeasureSource.Measure,
  [ModuleType.RainGaugeModule]: MeasureSource.Measure,
  [ModuleType.ThermostatRelay]: MeasureSource.Measure,
  [ModuleType.Thermostat]: MeasureSource.Measure,
  [ModuleType.Valves]: MeasureSource.Room,
};
