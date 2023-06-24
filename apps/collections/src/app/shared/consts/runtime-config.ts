import { InjectionToken } from '@angular/core';

import { RuntimeConfig } from '~shared/models/runtime-config';

export const RUNTIME_CONFIG = new InjectionToken<RuntimeConfig>('RuntimeConfig');
