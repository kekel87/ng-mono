import { BBox } from 'geojson';

import { LogEntrySave } from './log-entry';

export interface LogComputedField {
  start?: string;
  end?: string;

  bbox: BBox;
  geoJson: any;
  distance: number;
  elevationGain: number;
}

export interface Log extends LogComputedField {
  id: string;
  name: string;
  tags: string[];

  description?: string;
}

export interface LogSave extends Omit<Log, 'id'> {
  id?: string;
  entries: LogEntrySave[];
}
