import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';

import { authActions } from '~app/auth/auth.actions';
import * as authSelectors from '~app/auth/auth.selectors';

/**
 * AppInitService is a "Resolver".
 * It's waiting to check if user is logged, if his logged, it's waiting datas from server.
 * This allows to have a single loader and to arrive on the application with all datas ready.
 *
 * https://itnext.io/angular-app-initializer-ngrx-1d1340532fe3
 */
@Injectable()
export class AppInitService {
  constructor(private store: Store) {}

  onAppInit(): Promise<void> {
    this.store.dispatch(authActions.findUser());

    return new Promise((resolve) => {
      this.store
        .select(authSelectors.selectLoading)
        .pipe(
          filter((loading) => loading === false),
          first()
        )
        .subscribe(() => {
          resolve();
        });
    });
  }
}

export function appInitServiceFactory(service: AppInitService): () => Promise<void> {
  return () => service.onAppInit();
}
