import { createFeature, createReducer, on } from '@ngrx/store';

import { authActions } from './auth.actions';
import { User } from './user.model';

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
    on(authActions.findUserSuccess, (state, { user }): State => ({ ...state, user, loading: false })),
    on(
      authActions.notAuthenticated,
      (_, { redirectUrl }): State => ({
        ...initialState,
        redirectUrl: redirectUrl || '/',
        loading: false,
      })
    ),
    on(authActions.googleLogin, authActions.logout, (state): State => ({ ...state, loading: true })),
    on(authActions.error, (state): State => ({ ...state, loading: false }))
  ),
});
