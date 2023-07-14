import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { isEmpty, getElementAt } from '@ng-mono/shared/utils';

import { filterFeature } from './filter/filter.reducer';
import { homeFeature } from './home/home.reducer';
import { MeasureType } from '../api/enums/measure-type';
import { Home } from '../api/models/home';
import { Room } from '../api/models/room';
import { WeatherParams } from '../api/models/weather-params';
import { MEASURE_SOURCE_BY_MODULE_TYPE } from '../constants/measure-source-by-module-type';
import { MEASURE_TYPE_BY_MODULE_TYPE } from '../constants/measure-type-by-module-type';
import { MEASURE_TYPE_PALETTES } from '../constants/measure-type-palettes';
import { Interval } from '../models/interval';
import { ModuleMesureType } from '../models/module-measure-type';
import { ModuleWithEnabledMeasureTypes } from '../models/module-with-enabled-measure-types';
import { ModuleWithMeasureTypes } from '../models/module-with-measure-types';
import { ModuleWithRoom } from '../models/module-with-room';
import { hasRoom } from '../utils/has-room';
import { weatherEndDate } from '../utils/weather-end-date';

export const selectRooms = createSelector(homeFeature.selectHome, (home: Home | undefined): Room[] => home?.rooms ?? []);
export const selectModules = createSelector(homeFeature.selectHome, (home: Home | undefined): ModuleWithRoom[] => {
  if (!home || !home.modules) {
    return [];
  }

  return home.modules.filter(hasRoom);
});

/**
 * Remove same module type in same room
 * Remove module without types
 */
export const selectModulesWithMeasureType = createSelector(selectModules, (modules: ModuleWithRoom[]): ModuleWithMeasureTypes[] => {
  return modules
    .filter((value, index, self) => index === self.findIndex((t) => t.type === value.type && t.room_id === value.room_id))
    .map((module, index) => ({
      ...module,
      measureSource: MEASURE_SOURCE_BY_MODULE_TYPE[module.type],
      measureType: MEASURE_TYPE_BY_MODULE_TYPE[module.type],
      measureTypeColors: MEASURE_TYPE_BY_MODULE_TYPE[module.type].reduce(
        (acc, type) => ({ ...acc, [type]: getElementAt(MEASURE_TYPE_PALETTES[type], index) }),
        {}
      ),
    }))
    .filter((m) => m.measureType.length > 0);
});

export const selectModulesEntities = createSelector(
  selectModulesWithMeasureType,
  (modules: ModuleWithMeasureTypes[]): Dictionary<ModuleWithMeasureTypes> => {
    return modules.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
  }
);

export const selectEnabledModuleMeasureTypesByModule = createSelector(
  filterFeature.selectAll,
  (modules: ModuleMesureType[]): Dictionary<MeasureType[]> => {
    return modules.reduce<{ [id: string]: MeasureType[] }>((acc, { id, type }) => ({ ...acc, [id]: [...(acc[id] ?? []), type] }), {});
  }
);

export const selectModuleWithEnabledMeasureType = createSelector(
  selectEnabledModuleMeasureTypesByModule,
  selectModulesWithMeasureType,
  (enabled: Dictionary<MeasureType[]>, modules: ModuleWithMeasureTypes[]): ModuleWithEnabledMeasureTypes[] =>
    modules.reduce<ModuleWithEnabledMeasureTypes[]>(
      (acc, curr) => (isEmpty(enabled[curr.id]) ? acc : [...acc, { ...curr, enabledMeasureTypes: enabled[curr.id]! }]),
      []
    )
);

export const selectWheaterParams = createSelector(
  homeFeature.selectHome,
  filterFeature.selectInterval,
  filterFeature.selectTemparatureForecast,
  filterFeature.selectHumidityForecast,
  (home: Home | undefined, interval: Interval, temparatureForecast: boolean, humidityForecast: boolean): WeatherParams | undefined => {
    if (!home || (!temparatureForecast && !humidityForecast)) {
      return undefined;
    }

    const hourly = [];
    if (temparatureForecast) {
      hourly.push('temperature_2m');
    }

    if (humidityForecast) {
      hourly.push('relativehumidity_2m');
    }

    return {
      longitude: home.coordinates[0],
      latitude: home.coordinates[1],
      hourly: hourly.join(','),
      start_date: interval.begin.split('T')[0],
      end_date: weatherEndDate(interval.end),
    };
  }
);
