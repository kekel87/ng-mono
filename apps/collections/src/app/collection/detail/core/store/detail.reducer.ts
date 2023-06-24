import { createFeature, createReducer, on } from '@ngrx/store';

import { SaveState } from '~shared/enums/save-state';

import { collectionDetailActions } from './detail.actions';
import { collectionsActions } from '../../../core/entities/collections.actions';

export interface State {
  loading: boolean;
  saveState: SaveState;
}

export const initialState: State = {
  loading: false,
  saveState: SaveState.Unchanged,
};

export const detailFeature = createFeature({
  name: 'detail',
  reducer: createReducer(
    initialState,
    on(collectionsActions.delete, (state): State => ({ ...state, loading: true })),
    on(collectionsActions.deleteSuccess, (state): State => ({ ...state, loading: false })),
    on(collectionsActions.save, (state): State => ({ ...state, saveState: SaveState.Saving })),
    on(collectionsActions.saveSuccess, (state): State => ({ ...state, saveState: SaveState.Saved })),
    on(collectionDetailActions.setSaveState, (state, { saveState }): State => ({ ...state, saveState }))
  ),
});
