import { createActionGroup, props, emptyProps } from '@ngrx/store';

import { EntrySave } from '../../models/entry';
import { Log, LogSave } from '../../models/log';

export const logActions = createActionGroup({
  source: 'Log',
  events: {
    load: emptyProps(),
    loadSuccess: props<{ logs: Log[] }>(),
    loadError: emptyProps(),

    saveLogAndEntries: props<{ log: LogSave; entries: EntrySave[] }>(),

    save: props<{ log: LogSave }>(),
    saveSuccess: props<{ log: Log }>(),
    saveError: emptyProps(),

    delete: props<{ id: string }>(),
    deleteSuccess: emptyProps(),
    deleteError: emptyProps(),
  },
});
