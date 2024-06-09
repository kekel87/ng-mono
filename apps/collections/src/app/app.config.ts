import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { Store, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideAuth } from '@ng-mono/auth';
import { RouterEffects } from '@ng-mono/shared/utils';
import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { RuntimeConfig } from '~shared/models/runtime-config';

import appRoutes from './app.routes';
import { initializeAppFactory } from './core/initialize-app-factory';
import { LayoutEffects } from './core/layout/layout.effects';
import { layoutFeature } from './core/layout/layout.feature';

export const appConfig: (runtimeConfig: RuntimeConfig) => ApplicationConfig = (runtimeConfig: RuntimeConfig) => ({
  providers: [
    { provide: RUNTIME_CONFIG, useValue: runtimeConfig },
    provideHttpClient(),
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', { enabled: location.hostname !== 'localhost' }),
    provideStore(
      {
        router: routerReducer,
        [layoutFeature.name]: layoutFeature.reducer,
      },
      { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }
    ),
    ...(runtimeConfig.ngrx.devtoolsOptions ? [provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions)] : []),
    provideRouterStore(),
    provideEffects(RouterEffects, LayoutEffects),
    provideAnimations(),
    provideAuth(runtimeConfig.supabase),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [Store],
    },
  ],
});
