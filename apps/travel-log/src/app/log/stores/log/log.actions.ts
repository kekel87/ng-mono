import { createActionGroup, props, emptyProps } from '@ngrx/store';

import { Log, LogSave } from '../../models/log';

export const logActions = createActionGroup({
  source: 'Log',
  events: {
    load: emptyProps(),
    loadSuccess: props<{ logs: Log[] }>(),
    loadError: emptyProps(),

    save: props<{ log: LogSave }>(),
    saveSuccess: props<{ log: Log }>(),
    saveError: emptyProps(),
  },
});
