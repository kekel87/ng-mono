import { BBox } from 'geojson';

export interface Entry {
  id: string;
  log: string;
  name: string;

  gpx: string;
  bbox: BBox;
  geoJson: any;

  distance: number;
  elevationGain: number;

  start: string | null;
  end: string | null;
  movingTime: number | null;
  averageMovingSpeed: number | null;
  averageTemperature: number | null;
}

export type EntrySave = Partial<Entry>;
