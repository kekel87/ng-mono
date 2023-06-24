import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { LinkState } from '~shared/enums/link-state';

import { counterActions } from './counter.actions';
import { Counter } from './counter.model';

export interface State extends EntityState<Counter> {
  collectionState: LinkState;
}
export const adapter = createEntityAdapter<Counter>();

const initialState: State = adapter.getInitialState({
  collectionState: LinkState.Initial,
});

export const counterFeature = createFeature({
  name: 'counter',
  reducer: createReducer(
    initialState,
    on(counterActions.init, (state): State => ({ ...state, collectionState: LinkState.Loading })),
    on(
      counterActions.initSuccess,
      (state): State => ({
        ...state,
        collectionState: LinkState.Linked,
      })
    ),
    on(counterActions.dataChange, (state, { counters }): State => adapter.setAll(counters, state)),
    on(counterActions.error, (state): State => ({ ...state, collectionState: LinkState.Error }))
  ),
});
