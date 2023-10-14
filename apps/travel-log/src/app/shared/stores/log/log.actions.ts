import { createActionGroup, props, emptyProps } from '@ngrx/store';

import { Log } from '../../models/log';

export const logActions = createActionGroup({
  source: 'Log',
  events: {
    load: emptyProps(),
    loadSuccess: props<{ logs: Log[] }>(),
    loadError: emptyProps(),
  },
});
