import { RequestState } from '@ng-mono/shared/utils';

import { Log } from './log';

export interface LogObject extends Omit<Log, 'entries'> {
  id: string;
  entries: string[];
  load: RequestState;
  geoJson?: any;
  distance?: number;
}
