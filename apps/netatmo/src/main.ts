import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideOAuthClient, AuthConfig } from 'angular-oauth2-oidc';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { RuntimeConfig } from './app/shared/models/runtime-config';

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
        },
        { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }
      ),
      provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions),
      provideRouterStore(),
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
