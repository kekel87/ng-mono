import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SnackbarOptions, ToolbarConfig } from './layout.models';

export const layoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Open search bar': emptyProps(),
    'Close search bar': emptyProps(),
    search: props<{ search: string }>(),
    'Toggle Sidenav': emptyProps(),
    'Open snackbar': props<{ options: SnackbarOptions }>(),
    'Set toolbar': props<{ toolbarConfig: ToolbarConfig }>(),
    'Reset toolbar': emptyProps(),
  },
});
