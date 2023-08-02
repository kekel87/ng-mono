import { BBox } from 'geojson';

import { LogEntry } from './log-entry';

export interface Log {
  id: string;
  title: string;
  bbox: BBox;
  description?: string;
  tags: string[];
  entries: LogEntry[];
  startDate?: string;
  endDate?: string;
}
