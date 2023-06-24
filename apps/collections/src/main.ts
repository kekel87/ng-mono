import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { RuntimeConfig } from '~shared/models/runtime-config';

import { AppModule } from './app/app.module';

async function loadConfig(): Promise<RuntimeConfig> {
  const response = await fetch('/assets/runtime-config.json');
  return response.json();
}

(async () => {
  const runtimeConfig = await loadConfig();

  platformBrowserDynamic([{ provide: RUNTIME_CONFIG, useValue: runtimeConfig }])
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
})();
