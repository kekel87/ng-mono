import { createActionGroup, props, emptyProps } from '@ngrx/store';

import { IntervalType } from '../../enums/interval-type';
import { ModuleMesureType } from '../../models/module-measure-type';

export const filterActions = createActionGroup({
  source: 'filter',
  events: {
    'Change auto refresh': props<{ autoRefresh: boolean }>(),
    'Toggle temperature forecast': props<{ temparatureForecast: boolean }>(),
    'Toggle humidity forecast': props<{ humidityForecast: boolean }>(),
    'Change interval type': props<{ intervalType: IntervalType }>(),
    'Next interval': emptyProps(),
    'Previous interval': emptyProps(),
    refresh: emptyProps(),
    'Enable many module measure': props<{ moduleMeasureTypes: ModuleMesureType[] }>(),
    'Enable module measure': props<{ moduleMeasureType: ModuleMesureType }>(),
    'Disable module measure': props<{ moduleMeasureType: ModuleMesureType }>(),
  },
});
