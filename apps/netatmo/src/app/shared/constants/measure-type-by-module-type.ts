import { MeasureType } from '../api/enums/measure-type';
import { ModuleType } from '../api/enums/module-type';

export const MEASURE_TYPE_BY_MODULE_TYPE: Record<ModuleType, MeasureType[]> = {
  [ModuleType.WeatherStation]: [MeasureType.Pressure, MeasureType.Noise, MeasureType.CO2, MeasureType.Humidity, MeasureType.Temperature],
  [ModuleType.OutdoorModule]: [MeasureType.Humidity, MeasureType.Temperature],
  [ModuleType.IndoorModule]: [MeasureType.CO2, MeasureType.Humidity, MeasureType.Temperature],
  [ModuleType.AnemometerModule]: [MeasureType.WindStrength],
  [ModuleType.RainGaugeModule]: [MeasureType.Rain],
  [ModuleType.ThermostatRelay]: [],
  [ModuleType.Thermostat]: [MeasureType.SumBoilerOn, MeasureType.Temperature],
  [ModuleType.Valves]: [MeasureType.Temperature],
};
