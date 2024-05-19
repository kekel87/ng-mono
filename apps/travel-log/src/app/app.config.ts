import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appRoutes } from './app.routes';
import { layoutFeature } from './layout/store/layout.feature';
import { LogEffects } from './log/stores/log/log.effects';
import { logFeature } from './log/stores/log/log.feature';
import { LogEntryEffects } from './log/stores/log-entry/log-entry.effects';
import { logEntryFeature } from './log/stores/log-entry/log-entry.feature';
import { RuntimeConfig } from './shared/models/runtime-config';

export const appConfig: (runtimeConfig: RuntimeConfig) => ApplicationConfig = (runtimeConfig: RuntimeConfig) => ({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideStore({ router: routerReducer }, { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }),
    provideState(layoutFeature),
    provideState(logFeature),
    provideState(logEntryFeature),
    provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions),
    provideRouterStore(),
    provideEffects(LogEffects, LogEntryEffects),
    importProvidersFrom(BrowserAnimationsModule),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' } },
  ],
});
