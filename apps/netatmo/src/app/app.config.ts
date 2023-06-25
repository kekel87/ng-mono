import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideOAuthClient, AuthConfig } from 'angular-oauth2-oidc';

import { appRoutes } from './app.routes';
import { layoutFeature } from './layout/store/layout.reducer';
import { RuntimeConfig } from './shared/models/runtime-config';
import { FilterEffects } from './shared/stores/filter/filter.effects';
import { filterFeature } from './shared/stores/filter/filter.reducer';
import { HomeEffects } from './shared/stores/home/home.effects';
import { homeFeature } from './shared/stores/home/home.reducer';
import { MeasureEffects } from './shared/stores/measure/measure.effects';
import { measureFeature } from './shared/stores/measure/measure.reducer';

export const appConfig: (runtimeConfig: RuntimeConfig) => ApplicationConfig = (runtimeConfig: RuntimeConfig) => ({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    {
      provide: AuthConfig,
      useValue: {
        ...runtimeConfig.auth2,
        redirectUri: window.location.origin + runtimeConfig.auth2.redirectUri,
      },
    },
    provideStore(
      {
        router: routerReducer,
        [layoutFeature.name]: layoutFeature.reducer,
        [homeFeature.name]: homeFeature.reducer,
        [filterFeature.name]: filterFeature.reducer,
        [measureFeature.name]: measureFeature.reducer,
      },
      { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }
    ),
    provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions),
    provideRouterStore(),
    provideEffects(HomeEffects, FilterEffects, MeasureEffects),
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ['https://api.netatmo.com/api'],
        sendAccessToken: true,
      },
    }),
    importProvidersFrom(BrowserAnimationsModule),
  ],
});
