import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const layoutActions = createActionGroup({
  source: 'Layout',
  events: {
    toggleSidenav: emptyProps(),
    setSidenav: props<{ opened: boolean }>(),
    sidenavStartAnimated: emptyProps(),
    sidenavEndAnimated: emptyProps(),
  },
});
