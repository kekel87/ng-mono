import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';

import * as authReducer from './auth/auth.reducer';
import * as layoutReducer from './core/layout/layout.reducer';
import { RouterStateUrl } from './core/router/simple-router.serializer';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  layout: layoutReducer.State;
  auth: authReducer.State;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  layout: layoutReducer.layoutFeature.reducer,
  auth: authReducer.authFeature.reducer,
  router: fromRouter.routerReducer,
};
