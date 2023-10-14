import { createFeature, createReducer, on } from '@ngrx/store';

import { layoutActions } from './layout.actions';

export interface State {
  openedSidenav: boolean;
}

const initialState: State = {
  openedSidenav: false,
};

export const layoutFeature = createFeature({
  name: 'layout',
  reducer: createReducer(
    initialState,
    on(layoutActions.toggleSidenav, (state): State => ({ ...state, openedSidenav: !state.openedSidenav })),
    on(layoutActions.setSidenav, (state, { opened }): State => ({ ...state, openedSidenav: opened }))
  ),
});
