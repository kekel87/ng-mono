import { createActionGroup, props } from '@ngrx/store';
import { BBox } from 'geojson';

export const mapActions = createActionGroup({
  source: 'map',
  events: {
    fit: props<{ bbox: BBox }>(),
  },
});
