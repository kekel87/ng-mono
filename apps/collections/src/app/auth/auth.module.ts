import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AccessDeniedModule } from './access-denied/access-denied.component';
import { AuthEffects } from './auth.effets';
import { authFeature } from './auth.reducer';
import { AuthRoutingModule } from './auth.routing';
import { LoginModule } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    StoreModule.forFeature(authFeature),
    EffectsModule.forFeature([AuthEffects]),
    LoginModule,
    AccessDeniedModule,
  ],
})
export class AuthModule {}
