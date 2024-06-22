import { BBox } from 'geojson';

export interface Log {
  id: string;
  name: string | null;
  tags: string[];

  description: string | null;

  bbox: BBox | null;
  geoJson: any | null;
  distance: number | null;
  elevationGain: number | null;

  start: string | null;
  end: string | null;
}

export interface LogSave extends Omit<Partial<Log>, 'id' | 'tags'> {
  id: string | null;
}
