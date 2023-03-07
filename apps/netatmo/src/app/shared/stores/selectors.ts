import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { homeFeature } from './home/home.reducer';
import { Home } from '../api/models/home';
import { Room } from '../api/models/room';
import { MEASURE_TYPE_BY_MODULE_TYPE } from '../constants/measure-type-by-module-type';
import { ModuleWithMeasureTypes } from '../models/module-with-measure-types';
import { ModuleWithRoom } from '../models/module-with-room';
import { hasRoom } from '../utils/has-room';

export const selectRooms = createSelector(homeFeature.selectHome, (home: Home | undefined): Room[] => home?.rooms ?? []);
export const selectModules = createSelector(homeFeature.selectHome, (home: Home | undefined): ModuleWithRoom[] => {
  if (!home || !home.modules) {
    return [];
  }

  return home.modules.filter(hasRoom);
});

export const selectModulesWithMeasureType = createSelector(selectModules, (modules: ModuleWithRoom[]): ModuleWithMeasureTypes[] => {
  return modules.map((m) => ({ ...m, measureType: MEASURE_TYPE_BY_MODULE_TYPE[m.type] }));
});

export const selectModulesEntities = createSelector(
  selectModulesWithMeasureType,
  (modules: ModuleWithMeasureTypes[]): Dictionary<ModuleWithMeasureTypes> => {
    return modules.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
  }
);
