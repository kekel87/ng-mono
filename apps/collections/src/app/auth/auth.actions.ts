import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User } from './user.model';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    findUser: emptyProps(),
    findUserSuccess: props<{ user: User }>(),
    notAuthenticated: props<{ redirectUrl?: string }>(),
    redirect: emptyProps(),
    googleLogin: emptyProps(),
    emailPasswordLogin: props<{ email: string; password: string }>(),
    loginSuccess: emptyProps(),
    logout: emptyProps(),
    error: props<{ error?: string }>(),
  },
});
