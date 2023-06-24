import { createSelector } from '@ngrx/store';

import { authFeature } from '~app/auth/auth.reducer';
import { User } from '~app/auth/user.model';

export const { selectUser, selectLoading, selectRedirectUrl } = authFeature;

export const selectIsLoggedIn = createSelector(selectUser, (user: User | null): boolean => !!user);
