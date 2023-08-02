import { createActionGroup, props } from '@ngrx/store';

import { Log } from '../../models/log';

export const logObjectActions = createActionGroup({
  source: 'LogObject',
  events: {
    set: props<{ log: Log }>(),
    geoJsonSuccess: props<{ id: string; geoJson: any; distance: number }>(),
  },
});
