import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RuntimeChecks, StoreModule, ACTIVE_RUNTIME_CHECKS } from '@ngrx/store';
import { INITIAL_OPTIONS, StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';

import { appInitServiceFactory, AppInitService } from '~app/core/app-init.service';
import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { RuntimeConfig } from '~shared/models/runtime-config';

import { AppComponent } from './app.component';
import { reducers } from './app.reducer';
import { AppRoutingModule } from './app.routing';
import { AuthModule } from './auth/auth.module';
import { LayoutModule } from './core/layout/layout.module';
import { RouterEffects } from './core/router/router.effects';

export function runtimeChecksFactory({ ngrx }: RuntimeConfig): () => Partial<RuntimeChecks> {
  return () => ngrx.runtimeChecks;
}

export function storeDevtoolsOptionsFactory({ ngrx }: RuntimeConfig): () => StoreDevtoolsOptions {
  return () => ngrx.devtoolsOptions;
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js'),
    provideFirebaseApp((injector) => initializeApp(injector.get(RUNTIME_CONFIG).firebase), RUNTIME_CONFIG),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule,
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([RouterEffects]),
    AuthModule,
    AppRoutingModule,
    LayoutModule,
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: SwRegistrationOptions,
      useFactory: () => ({ enabled: location.hostname !== 'localhost' }),
    },
    {
      provide: ACTIVE_RUNTIME_CHECKS,
      useFactory: runtimeChecksFactory,
      deps: [RUNTIME_CONFIG],
    },
    {
      provide: INITIAL_OPTIONS,
      useFactory: storeDevtoolsOptionsFactory,
      deps: [RUNTIME_CONFIG],
    },
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitServiceFactory,
      multi: true,
      deps: [AppInitService, RUNTIME_CONFIG],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
