import { createFeature, createReducer, on } from '@ngrx/store';

import { layoutActions } from './layout.actions';
import { SnackbarOptions, ToolbarConfig } from './layout.models';

export interface State {
  showSearchBar: boolean;
  search: string;
  showSidenav: boolean;
  snackbarOptions: SnackbarOptions | null;
  toolbarConfig: ToolbarConfig;
}

const initialState: State = {
  showSearchBar: false,
  search: '',
  showSidenav: false,
  snackbarOptions: null,
  toolbarConfig: { title: 'Collections' },
};

export const layoutFeature = createFeature({
  name: 'layout',
  reducer: createReducer(
    initialState,
    on(layoutActions.openSearchBar, (state): State => ({ ...state, showSearchBar: true })),
    on(layoutActions.closeSearchBar, (state): State => ({ ...state, showSearchBar: false, search: '' })),
    on(layoutActions.search, (state, { search }): State => ({ ...state, search })),
    on(layoutActions.toggleSidenav, (state): State => ({ ...state, showSidenav: !state.showSidenav })),
    on(layoutActions.setToolbar, (state, { toolbarConfig }): State => ({ ...state, toolbarConfig })),
    on(
      layoutActions.resetToolbar,
      (state): State => ({
        ...state,
        toolbarConfig: initialState.toolbarConfig,
      })
    )
  ),
});
