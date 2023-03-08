import { createActionGroup, props, emptyProps } from '@ngrx/store';

import { MeasureSource } from '../../models/measure-source';
import { ModuleMesureType } from '../../models/module-measure-type';

export const measureActions = createActionGroup({
  source: 'Measure',
  events: {
    fetch: props<{ moduleMeasureType: ModuleMesureType }>(),
    'Fetch many': emptyProps(),
    'Fetch success': props<{ measures: MeasureSource[] }>(),
    'Fetch error': emptyProps(),
  },
});
