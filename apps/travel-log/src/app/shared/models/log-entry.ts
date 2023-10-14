import { BBox } from 'geojson';

export interface LogEntry {
  id: string;
  title: string;
  bbox: BBox;
  gpx: string;
  startDate?: Date;
  endDate?: Date;
}
