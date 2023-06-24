import { FirebaseError } from 'firebase/app';

export abstract class MockFirebaseError {
  static readonly base: FirebaseError = new FirebaseError('error', '');
  static readonly userDisabled: FirebaseError = new FirebaseError('auth/user-disabled', '');
  static readonly permissionDenied: FirebaseError = new FirebaseError('permission-denied', '');
}
