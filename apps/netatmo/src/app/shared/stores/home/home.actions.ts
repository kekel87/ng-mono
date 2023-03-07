import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { HomesDataResponse } from '../../api/models/home-data-response';

export const homeActions = createActionGroup({
  source: 'home',
  events: {
    fetch: emptyProps(),
    'Fetch Success': props<{ homeData: HomesDataResponse }>(),
    'Fetch Error': emptyProps(),
    select: props<{ id: string }>(),
  },
});
