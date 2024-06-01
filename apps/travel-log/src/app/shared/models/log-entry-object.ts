import { RequestState } from '@ng-mono/shared/utils';

import { LogEntry } from './log-entry';

export interface LogEntryObject extends LogEntry {
  logId: string;
  load: RequestState;
  displayed: boolean;
  geoJson?: any;
  start?: string;
  end?: string;
  distance?: number;
  movingTime?: number;
  averageMovingSpeed?: number;
  averageTemperature?: number;
  elevationGain?: number;
}
