import { RuntimeChecks } from '@ngrx/store';
import { StoreDevtoolsOptions } from '@ngrx/store-devtools';

export interface RuntimeConfig {
  isQa: boolean;
  corsAnywhere: string;
  supabase: {
    url: string;
    key: string;
  };
  googleSearch: {
    url: string;
    apiKey: string;
    cseId: string;
  };
  ngrx: {
    runtimeChecks: Partial<RuntimeChecks>;
    devtoolsOptions?: StoreDevtoolsOptions;
  };
}
