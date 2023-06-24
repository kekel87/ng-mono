import { createSelector } from '@ngrx/store';

import { toPredicate } from '~shared/utils/string';

import { layoutFeature } from './layout.reducer';

export const { selectShowSidenav, selectToolbarConfig, selectShowSearchBar, selectSearch } = layoutFeature;

export const selectSearchPredicate = createSelector(selectSearch, (search: string): string => toPredicate(search));
