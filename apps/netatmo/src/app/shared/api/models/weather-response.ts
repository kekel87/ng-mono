export interface WeatherResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m?: number[];
    relativehumidity_2m?: number[];
  };
}
