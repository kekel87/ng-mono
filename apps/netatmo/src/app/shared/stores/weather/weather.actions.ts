import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { WeatherResponse } from '../../api/models/weather-response';

export const weatherActions = createActionGroup({
  source: 'weather',
  events: {
    fetch: emptyProps(),
    'Fetch Success': props<{ response: WeatherResponse }>(),
    'Fetch Error': emptyProps(),
  },
});
