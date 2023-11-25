import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { Store, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { RuntimeConfig } from '~shared/models/runtime-config';

import appRoutes from './app.routes';
import { AuthEffects } from './auth/auth.effets';
import { authFeature } from './auth/auth.feature';
import { initializeAppFactory } from './core/initialize-app-factory';
import { LayoutEffects } from './core/layout/layout.effects';
import { layoutFeature } from './core/layout/layout.feature';
import { RouterEffects } from './core/router/router.effects';

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
        [authFeature.name]: authFeature.reducer,
      },
      { runtimeChecks: runtimeConfig.ngrx.runtimeChecks }
    ),
    provideStoreDevtools(runtimeConfig.ngrx.devtoolsOptions),
    provideRouterStore(),
    provideEffects(RouterEffects, LayoutEffects, AuthEffects),
    provideAnimations(),
    importProvidersFrom(
      provideFirebaseApp((injector) => initializeApp(injector.get(RUNTIME_CONFIG).firebase), RUNTIME_CONFIG),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
      provideStorage(() => getStorage())
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [Store],
    },
  ],
});
