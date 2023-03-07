import { createActionGroup, props } from '@ngrx/store';

import { ModuleMesureType } from '../../models/module-measure-type';

export const filterActions = createActionGroup({
  source: 'filter',
  events: {
    // fetch: emptyProps(),
    'Enable many module measure': props<{ moduleMeasureTypes: ModuleMesureType[] }>(),
    'Enable module measure': props<{ moduleMeasureType: ModuleMesureType }>(),
    'Disable module measure': props<{ moduleMeasureType: ModuleMesureType }>(),
  },
});
