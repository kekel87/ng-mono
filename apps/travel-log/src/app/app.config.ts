import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appRoutes } from './app.routes';
import { layoutFeature } from './layout/store/layout.reducer';
import { RuntimeConfig } from './shared/models/runtime-config';

export const appConfig: (runtimeConfig: RuntimeConfig) => ApplicationConfig = (runtimeConfig: RuntimeConfig) => ({
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideStore(
      {
        router: routerReducer,
        [layoutFeature.name]: layoutFeature.reducer,
      },
      { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }
    ),
    provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions),
    provideRouterStore(),
    importProvidersFrom(BrowserAnimationsModule),
  ],
});
