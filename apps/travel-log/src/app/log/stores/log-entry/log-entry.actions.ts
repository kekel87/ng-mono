import { createActionGroup, props } from '@ngrx/store';

import { LogEntry } from '../../models/log-entry';

export const logEntryActions = createActionGroup({
  source: 'LogEntry',
  events: {
    set: props<{ logEntry: LogEntry; logId: string }>(),
    load: props<{ id: string }>(),
    loadSuccess: props<{ entry: LogEntry }>(),
    loadError: props<{ id: string }>(),
  },
});
