import { createActionGroup, props } from '@ngrx/store';

import { LogEntry } from '../../models/log-entry';

export const logEntryObjectActions = createActionGroup({
  source: 'LogEntryObject',
  events: {
    set: props<{ logEntry: LogEntry; logId: string }>(),
    loadFile: props<{ id: string; url: string }>(),
    loadFileSuccess: props<{ id: string; file: string }>(),
    loadFileError: props<{ id: string }>(),
  },
});
