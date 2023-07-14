import { createActionGroup, props, emptyProps } from '@ngrx/store';

import { MeasureEntry } from '../../models/measure-entry';
import { ModuleMesureType } from '../../models/module-measure-type';

export const measureActions = createActionGroup({
  source: 'Measure',
  events: {
    fetch: props<{ moduleMeasureType: ModuleMesureType }>(),
    'Fetch many': emptyProps(),
    'Fetch success': props<{ measures: MeasureEntry[] }>(),
    upsertMany: props<{ measures: MeasureEntry[] }>(),
    'Fetch error': emptyProps(),
  },
});
