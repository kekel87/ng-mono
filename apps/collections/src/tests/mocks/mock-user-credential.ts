import { OperationType, User, UserCredential } from '@angular/fire/auth';

import { mockUser } from '~tests/mocks/user';

export abstract class MockUserCredential {
  static readonly base: UserCredential = {
    user: mockUser as unknown as User,
    providerId: null,
    operationType: OperationType.SIGN_IN,
  };
}
