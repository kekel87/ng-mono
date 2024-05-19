import { BBox } from 'geojson';

export interface LogEntry {
  id: string;
  name: string;

  gpx: string;
  bbox: BBox;
  geoJson: any;

  distance: number;
  elevationGain: number;

  start?: string;
  end?: string;
  movingTime?: number;
  averageMovingSpeed?: number;
  averageTemperature?: number;
}

export type LogEntrySave = Omit<LogEntry, 'id'> & { id?: string };
