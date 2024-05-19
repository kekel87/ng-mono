import { gpx as gpxToGeoJson } from '@tmcw/togeojson';
import bbox from '@turf/bbox';
import { FeatureCollection, Geometry } from 'geojson';
import { GPX } from 'leaflet';

import { LogEntrySave } from '../models/log-entry';

export function gpxToLogEntrySave(raw: string): LogEntrySave {
  const gpx = new GPX(raw, {
    async: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    marker_options: {
      startIconUrl: undefined,
      endIconUrl: undefined,
      shadowUrl: undefined,
    },
  });
  const geoJson = gpxToGeoJson(new DOMParser().parseFromString(raw, 'text/xml')) as FeatureCollection<Geometry>;

  return {
    name: gpx.get_name(),
    gpx: raw,
    geoJson,
    bbox: bbox(geoJson),
    start: gpx.get_start_time().toISOString(),
    end: gpx.get_end_time().toISOString(),
    distance: gpx.get_distance(),
    movingTime: gpx.get_moving_time(),
    averageMovingSpeed: gpx.get_moving_speed(),
    averageTemperature: gpx.get_average_temp(),
    elevationGain: gpx.get_elevation_gain(),
  };
}
