import { FirebaseError } from 'firebase/app';

export function isFirebaseError(input: unknown): input is FirebaseError {
  return input instanceof FirebaseError;
}
