import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SnackbarOptions, ToolbarConfig } from './layout.models';

export const layoutActions = createActionGroup({
  source: 'Layout',
  events: {
    openSearchBar: emptyProps(),
    closeSearchBar: emptyProps(),
    search: props<{ search: string }>(),
    toggleSidenav: emptyProps(),
    openSnackbar: props<{ options: SnackbarOptions }>(),
    setToolbar: props<{ toolbarConfig: ToolbarConfig }>(),
    resetToolbar: emptyProps(),
  },
});
