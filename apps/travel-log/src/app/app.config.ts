import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { authActions, authFeature, provideAuth } from '@ng-mono/auth';
import { RouterEffects } from '@ng-mono/shared/utils';

import { appRoutes } from './app.routes';
import { layoutFeature } from './layout/store/layout.feature';
import { LogEffects } from './log/stores/log/log.effects';
import { logFeature } from './log/stores/log/log.feature';
import { LogEntryEffects } from './log/stores/log-entry/log-entry.effects';
import { logEntryFeature } from './log/stores/log-entry/log-entry.feature';
import { RuntimeConfig } from './shared/models/runtime-config';

export function initializeAppFactory(store: Store): () => Observable<boolean> {
  return () => {
    store.dispatch(authActions.init());

    return store.select(authFeature.selectLoading).pipe(
      filter((loading) => loading === false),
      first()
    );
  };
}

export const appConfig: (runtimeConfig: RuntimeConfig) => ApplicationConfig = (runtimeConfig: RuntimeConfig) => ({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes),
    provideStore({ router: routerReducer }, { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }),
    provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions),
    provideRouterStore(),
    provideAuth(runtimeConfig.supabase),
    provideEffects(RouterEffects, LogEffects, LogEntryEffects),
    provideState(layoutFeature),
    provideState(logFeature),
    provideState(logEntryFeature),
    provideAnimationsAsync(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' } },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [Store],
    },
  ],
});
