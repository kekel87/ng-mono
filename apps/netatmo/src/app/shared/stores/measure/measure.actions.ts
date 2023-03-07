import { createActionGroup, props, emptyProps } from '@ngrx/store';

import { MeasureSource } from '../../models/measure-source';

export const measureActions = createActionGroup({
  source: 'Measure',
  events: {
    'Fetch many': emptyProps(),
    'Fetch success': props<{ measures: MeasureSource[] }>(),
    'Fetch error': emptyProps(),
  },
});
