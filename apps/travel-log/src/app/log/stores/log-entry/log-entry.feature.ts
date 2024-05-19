import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import 'leaflet-gpx';
import { RequestState } from '@ng-mono/shared/utils';

import { logEntryActions } from './log-entry.actions';
import { LogEntry } from '../../models/log-entry';

interface LogEntryLoading {
  id: string;
  loadRequestState: RequestState.Loading;
}

interface LogEntryWithRequestState extends LogEntry {
  loadRequestState: RequestState;
}

type LogEntryForStore = LogEntryLoading | LogEntryWithRequestState;

export type State = EntityState<LogEntryForStore>;

const adapter = createEntityAdapter<LogEntryForStore>();
const initialState: State = adapter.getInitialState();

export const logEntryFeature = createFeature({
  name: 'logEntryObject',
  reducer: createReducer(
    initialState,
    on(
      logEntryActions.load,
      (state, { id }): State => adapter.updateOne({ id, changes: { loadRequestState: RequestState.Loading } }, state)
    ),
    on(logEntryActions.loadSuccess, (state, { entry }): State => {
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
      logEntryActions.loadError,
      (state, { id }): State => adapter.updateOne({ id, changes: { loadRequestState: RequestState.Error } }, state)
    )
    // on(
    //   logEntryActions.set,
    //   (state, { logEntry, logId }): State => adapter.upsertOne({ ...logEntry, logId, load: RequestState.Initial, displayed: true }, state)
    // ),
  ),
  extraSelectors: ({ selectLogEntryObjectState }) => {
    const entitySelectors = adapter.getSelectors(selectLogEntryObjectState);
    return {
      ...entitySelectors,
      // selectGeoJsonDisplayed: createSelector(entitySelectors.selectAll, (logEntryObjects) =>
      //   logEntryObjects.filter(({ displayed, geoJson }) => displayed && geoJson)
      // ),
    };
  },
});
