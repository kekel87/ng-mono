import { MeasureType } from '../api/enums/measure-type';
import { ModuleType } from '../api/enums/module-type';

export const MEASURE_TYPE_BY_MODULE_TYPE: Record<ModuleType, MeasureType[]> = {
  [ModuleType.WeatherStation]: [MeasureType.Temperature, MeasureType.CO2, MeasureType.Pressure, MeasureType.Humidity, MeasureType.Noise],
  [ModuleType.OutdoorModule]: [MeasureType.Temperature, MeasureType.Humidity],
  [ModuleType.IndoorModule]: [MeasureType.Temperature, MeasureType.Humidity, MeasureType.CO2],
  [ModuleType.AnemometerModule]: [MeasureType.WindStrength],
  [ModuleType.RainGaugeModule]: [MeasureType.Rain],
  [ModuleType.ThermostatRelay]: [],
  [ModuleType.Thermostat]: [MeasureType.SumBoilerOn, MeasureType.Temperature],
  [ModuleType.Valves]: [MeasureType.Temperature],
};
