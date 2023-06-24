import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User } from './user.model';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Find user': emptyProps(),
    'Find user success': props<{ user: User }>(),
    'Not authenticated': props<{ redirectUrl?: string }>(),
    redirect: emptyProps(),
    'Google login': emptyProps(),
    'Email password login': props<{ email: string; password: string }>(),
    'Login success': emptyProps(),
    logout: emptyProps(),
    error: props<{ error?: string }>(),
  },
});
