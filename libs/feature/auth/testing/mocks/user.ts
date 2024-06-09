import { User } from '../../src/lib/auth/models/user';

/* eslint-disable @typescript-eslint/naming-convention */
export const mockUser: User = {
  email: 'email',
  id: 'id',
  app_metadata: {},
  user_metadata: {
    avatar_url: 'avatar_url',
    name: 'name',
  },
  aud: 'aud',
  created_at: '',
};
/* eslint-enable @typescript-eslint/naming-convention */
