import { RuntimeChecks } from '@ngrx/store';
import { StoreDevtoolsOptions } from '@ngrx/store-devtools';
import { AuthConfig } from 'angular-oauth2-oidc';

export interface RuntimeConfig {
  auth2: AuthConfig;
  ngrx: {
    runtimeChecks: Partial<RuntimeChecks>;
    devtoolsOptions: StoreDevtoolsOptions;
  };
}
