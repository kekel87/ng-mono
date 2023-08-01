import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { RuntimeConfig } from './app/shared/models/runtime-config';

async function loadConfig(): Promise<RuntimeConfig> {
  const response = await fetch('/assets/runtime-config.json');
  return response.json();
}

(async () => {
  const runtimeConfig = await loadConfig();

  bootstrapApplication(AppComponent, appConfig(runtimeConfig)).catch((err) => console.error(err));
})();
