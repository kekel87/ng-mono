import { MeasureType } from '../api/enums/measure-type';
import { WeatherResponse } from '../api/models/weather-response';
import { MeasureEntry } from '../models/measure-entry';

export function weatherHourlyToMesureSource(hourly: WeatherResponse['hourly']): MeasureEntry[] {
  return hourly.time.map((timestamp, index) => {
    const date = new Date(timestamp);
    date.setTime(date.getTime() + 15 * 11 * 60 * 1000);
    return {
      id: 'weather_id',
      timestamp: date.toISOString(),
      ...(hourly.temperature_2m ? { [MeasureType.Temperature]: hourly.temperature_2m[index] } : {}),
      ...(hourly.relativehumidity_2m ? { [MeasureType.Humidity]: hourly.relativehumidity_2m[index] } : {}),
    };
  });
}
