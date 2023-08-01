import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const layoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Toggle Sidenav': emptyProps(),
    'Set Sidenav': props<{ opened: boolean }>(),
  },
});
