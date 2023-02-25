import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
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
      provideOAuthClient({
        resourceServer: {
          allowedUrls: ['https://api.netatmo.com/api'],
          sendAccessToken: true,
        },
      }),
    ],
  }).catch((err) => console.error(err));
})();
