import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { authActions, authFeature } from '@ng-mono/auth';

/**
 * initializeAppFactory is a "Resolver".
 * It's waiting to check if user is logged, if his logged, it's waiting datas from server.
 * This allows to have a single loader and to arrive on the application with all datas ready.
 *
 * https://itnext.io/angular-app-initializer-ngrx-1d1340532fe3
 */
export function initializeAppFactory(store: Store): () => Observable<boolean> {
  return () => {
    store.dispatch(authActions.init());

    return store.select(authFeature.selectLoading).pipe(
      filter((loading) => loading === false),
      first()
    );
  };
}
