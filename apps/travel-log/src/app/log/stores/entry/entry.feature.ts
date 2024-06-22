import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import 'leaflet-gpx';
import { RequestState } from '@ng-mono/shared/utils';

import { entryActions } from './entry.actions';
import { Entry } from '../../models/entry';

interface EntryLoading {
  id: string;
  loadRequestState: RequestState.Loading;
}

interface EntryWithRequestState extends Entry {
  loadRequestState: RequestState;
}

type EntryForStore = EntryLoading | EntryWithRequestState;

export type State = EntityState<EntryForStore>;

const adapter = createEntityAdapter<EntryForStore>();
const initialState: State = adapter.getInitialState();

export const entryFeature = createFeature({
  name: 'entry',
  reducer: createReducer(
    initialState,
    on(entryActions.load, (state, { id }): State => adapter.updateOne({ id, changes: { loadRequestState: RequestState.Loading } }, state)),
    on(entryActions.loadSuccess, (state, { entry }): State => {
      return adapter.updateOne(
        {
          id: entry.id,
          changes: {
            ...entry,
            loadRequestState: RequestState.Success,
          },
        },
        state
      );
    }),
    on(
      entryActions.loadError,
      (state, { id }): State => adapter.updateOne({ id, changes: { loadRequestState: RequestState.Error } }, state)
    )
    // on(
    //   logEntryActions.set,
    //   (state, { logEntry, logId }): State => adapter.upsertOne({ ...logEntry, logId, load: RequestState.Initial, displayed: true }, state)
    // ),
  ),
  extraSelectors: ({ selectEntryState }) => {
    const entitySelectors = adapter.getSelectors(selectEntryState);
    return {
      ...entitySelectors,
      // selectGeoJsonDisplayed: createSelector(entitySelectors.selectAll, (logEntryObjects) =>
      //   logEntryObjects.filter(({ displayed, geoJson }) => displayed && geoJson)
      // ),
    };
  },
});
