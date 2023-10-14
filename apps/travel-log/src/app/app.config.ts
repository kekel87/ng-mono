import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appRoutes } from './app.routes';
import { layoutFeature } from './layout/store/layout.feature';
import { RuntimeConfig } from './shared/models/runtime-config';
import { LogEffects } from './shared/stores/log/log.effects';
import { logFeature } from './shared/stores/log/log.feature';
import { LogEntryObjectEffects } from './shared/stores/log-entry-object/log-entry-object.effects';
import { logEntryObjectFeature } from './shared/stores/log-entry-object/log-entry-object.feature';
import { LogObjectEffects } from './shared/stores/log-object/log-object.effects';
import { logObjectFeature } from './shared/stores/log-object/log-object.feature';

export const appConfig: (runtimeConfig: RuntimeConfig) => ApplicationConfig = (runtimeConfig: RuntimeConfig) => ({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideStore(
      {
        router: routerReducer,
        [layoutFeature.name]: layoutFeature.reducer,
        [logFeature.name]: logFeature.reducer,
        [logObjectFeature.name]: logObjectFeature.reducer,
        [logEntryObjectFeature.name]: logEntryObjectFeature.reducer,
      },
      { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }
    ),
    provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions),
    provideRouterStore(),
    provideEffects(LogEntryObjectEffects, LogObjectEffects, LogEffects),
    importProvidersFrom(BrowserAnimationsModule),
  ],
});
