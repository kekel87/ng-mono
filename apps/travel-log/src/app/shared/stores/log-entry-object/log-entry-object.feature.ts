import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on, createSelector } from '@ngrx/store';
import { gpx as gpxToGeojson } from '@tmcw/togeojson';
import bbox from '@turf/bbox';
import 'leaflet-gpx';
import { FeatureCollection, Geometry } from 'geojson';
import { GPX } from 'leaflet';

import { RequestState } from '@ng-mono/shared/utils';

import { logEntryObjectActions } from './log-entry-object.actions';
import { LogEntryObject } from '../../models/log-entry-object';

const adapter: EntityAdapter<LogEntryObject> = createEntityAdapter<LogEntryObject>();

export type State = EntityState<LogEntryObject>;
export const initialState: State = adapter.getInitialState();

export const logEntryObjectFeature = createFeature({
  name: 'logEntryObject',
  reducer: createReducer(
    initialState,
    on(
      logEntryObjectActions.set,
      (state, { logEntry, logId }): State => adapter.upsertOne({ ...logEntry, logId, load: RequestState.Initial, displayed: true }, state)
    ),
    on(logEntryObjectActions.loadFile, (state, { id }): State => adapter.updateOne({ id, changes: { load: RequestState.Loading } }, state)),
    on(logEntryObjectActions.loadFileSuccess, (state, { id, file }): State => {
      const geoJson = gpxToGeojson(new DOMParser().parseFromString(file, 'text/xml')) as FeatureCollection<Geometry>;

      const gpx = new GPX(file, {
        async: false,
        marker_options: {
          startIconUrl: undefined,
          endIconUrl: undefined,
          shadowUrl: undefined,
        },
      });

      return adapter.updateOne(
        {
          id,
          changes: {
            geoJson,
            load: RequestState.Success,
            bbox: bbox(geoJson),
            start: gpx.get_start_time().toISOString(),
            end: gpx.get_end_time().toISOString(),
            distance: gpx.get_distance(),
            movingTime: gpx.get_moving_time(),
            averageMovingSpeed: gpx.get_moving_speed(),
            averageTemperature: gpx.get_average_temp(),
            elevationGain: gpx.get_elevation_gain(),
          },
        },
        state
      );
    }),
    on(
      logEntryObjectActions.loadFileError,
      (state, { id }): State => adapter.updateOne({ id, changes: { load: RequestState.Error } }, state)
    )
  ),
  extraSelectors: ({ selectLogEntryObjectState }) => {
    const entitySelectors = adapter.getSelectors(selectLogEntryObjectState);
    return {
      ...entitySelectors,
      selectGeoJsonDisplayed: createSelector(entitySelectors.selectAll, (logEntryObjects) =>
        logEntryObjects.filter(({ displayed, geoJson }) => displayed && geoJson)
      ),
    };
  },
});
