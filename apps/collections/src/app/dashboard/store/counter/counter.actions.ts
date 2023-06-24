import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Counter } from './counter.model';

export const counterActions = createActionGroup({
  source: 'Counter',
  events: {
    init: emptyProps(),
    'Init success': emptyProps(),
    'Data change': props<{ counters: Counter[] }>(),
    error: props<{ error?: string }>(),
  },
});
