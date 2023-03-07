import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideOAuthClient, AuthConfig } from 'angular-oauth2-oidc';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { layoutFeature } from './app/layout/store/layout.reducer';
import { RuntimeConfig } from './app/shared/models/runtime-config';
import { FilterEffects } from './app/shared/stores/filter/filter.effects';
import { filterFeature } from './app/shared/stores/filter/filter.reducer';
import { HomeEffects } from './app/shared/stores/home/home.effects';
import { homeFeature } from './app/shared/stores/home/home.reducer';
import { MeasureEffects } from './app/shared/stores/measure/measure.effects';
import { measureFeature } from './app/shared/stores/measure/measure.reducer';

async function loadConfig(): Promise<RuntimeConfig> {
  const response = await fetch('/assets/runtime-config.json');
  return response.json();
}

(async () => {
  const runtimeConfig = await loadConfig();

  bootstrapApplication(AppComponent, {
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
  }).catch((err) => console.error(err));
})();
