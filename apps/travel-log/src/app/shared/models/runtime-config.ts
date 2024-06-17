import { RuntimeChecks } from '@ngrx/store';
import { StoreDevtoolsOptions } from '@ngrx/store-devtools';

export interface RuntimeConfig {
  supabase: {
    url: string;
    key: string;
  };
  ngrx: {
    runtimeChecks: Partial<RuntimeChecks>;
    devtoolsOptions: StoreDevtoolsOptions;
  };
}
