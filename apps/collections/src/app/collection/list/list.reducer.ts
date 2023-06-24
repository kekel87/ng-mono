import { createFeature, createReducer, on } from '@ngrx/store';

import { collectionListActions } from './list.actions';

export interface State {
  scrollIndex: number | null;
}

export const initialState: State = {
  scrollIndex: null,
};

export const listFeature = createFeature({
  name: 'list',
  reducer: createReducer(
    initialState,
    on(
      collectionListActions.saveScrollIndex,
      (state, { scrollIndex }): State => ({
        ...state,
        scrollIndex,
      })
    )
  ),
});
