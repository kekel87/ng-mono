import { RuntimeChecks } from '@ngrx/store';
import { StoreDevtoolsOptions } from '@ngrx/store-devtools';

export interface RuntimeConfig {
  isQa: boolean;
  corsAnywhere: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
  };
  googleSearch: {
    url: string;
    apiKey: string;
    cseId: string;
  };
  ngrx: {
    runtimeChecks: Partial<RuntimeChecks>;
    devtoolsOptions: StoreDevtoolsOptions;
  };
}
