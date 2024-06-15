import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '@supabase/supabase-js';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    init: emptyProps(),

    setUser: props<{ user: User }>(),

    notAuthenticated: props<{ redirectUrl?: string }>(),
    redirect: emptyProps(),

    googleLogin: emptyProps(),
    emailPasswordLogin: props<{ email: string; password: string }>(),
    loginSuccess: emptyProps(),

    logout: emptyProps(),

    setError: props<{ error?: string }>(),
  },
});
