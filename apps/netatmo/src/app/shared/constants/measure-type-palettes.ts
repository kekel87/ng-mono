import { MeasureType } from '../api/enums/measure-type';

export const MEASURE_TYPE_PALETTES: Record<MeasureType, string[]> = {
  [MeasureType.Temperature]: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  [MeasureType.CO2]: ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999'],
  [MeasureType.Humidity]: ['#0000FF', '#1E90FF', '#4169E1', '#6495ED', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4682B4', '#6A5ACD'],
  [MeasureType.Pressure]: ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999'],
  [MeasureType.Noise]: ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999'],
  [MeasureType.SumBoilerOn]: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  [MeasureType.Rain]: ['#0000FF', '#1E90FF', '#4169E1', '#6495ED', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4682B4', '#6A5ACD'],
  [MeasureType.WindStrength]: ['#0000FF', '#1E90FF', '#4169E1', '#6495ED', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4682B4', '#6A5ACD'],
};
