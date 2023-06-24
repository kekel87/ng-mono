import { FirebaseError } from 'firebase/app';

export function hasValue<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

export function isFirebaseError(input: unknown): input is FirebaseError {
  return input instanceof FirebaseError;
}
