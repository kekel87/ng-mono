import { RuntimeConfig } from './../../app/shared/models/runtime-config';

export abstract class MockRuntimeConfig {
  static readonly base: RuntimeConfig = {
    isQa: true,
    corsAnywhere: 'corsAnywhere',
    supabase: {
      url: 'url',
      key: 'key',
    },
    googleSearch: {
      url: 'googleSearch',
      apiKey: 'apiKey',
      cseId: 'cseId',
    },
    ngrx: {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
      devtoolsOptions: {
        name: 'devtoolsOptions',
        maxAge: false,
        logOnly: true,
      },
    },
  };
}
