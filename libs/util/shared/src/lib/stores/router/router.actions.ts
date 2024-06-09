import { NavigationExtras } from '@angular/router';
import { createActionGroup, props } from '@ngrx/store';

export const routerActions = createActionGroup({
  source: 'Router',
  events: {
    navigate: props<{ commands: unknown[]; extras?: NavigationExtras }>(),
  },
});
