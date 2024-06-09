import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { SUPABASE_CONFIG, SupabaseConfig } from '@ng-mono/shared/utils';

import { AuthEffects } from './store/auth.effets';
import { authFeature } from './store/auth.feature';

export function provideAuth(config: SupabaseConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: SUPABASE_CONFIG, useValue: config }, provideState(authFeature), provideEffects(AuthEffects)]);
}
