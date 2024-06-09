import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { User } from '@supabase/supabase-js';

import { authActions } from './auth.actions';

export interface State {
  user: User | null;
  redirectUrl: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  redirectUrl: '/',
  loading: true,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(authActions.setUser, (state, { user }): State => ({ ...state, user, loading: false })),
    on(
      authActions.notAuthenticated,
      (_state, { redirectUrl }): State => ({
        ...initialState,
        redirectUrl: redirectUrl || '/',
        loading: false,
      })
    ),
    on(authActions.googleLogin, authActions.logout, (state): State => ({ ...state, loading: true })),
    on(authActions.setError, (state): State => ({ ...state, loading: false }))
  ),
  extraSelectors: ({ selectUser }) => ({
    selectIsLoggedIn: createSelector(selectUser, (user: User | null): boolean => !!user),
  }),
});
