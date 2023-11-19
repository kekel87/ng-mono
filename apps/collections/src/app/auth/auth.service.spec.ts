import { Auth, User, UserCredential } from '@angular/fire/auth';
import * as fireAuth from '@angular/fire/auth';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { mockUser } from '~tests/mocks/user';

import { AuthService } from './auth.service';

jest.mock('@angular/fire/auth');

describe('AuthService', () => {
  let authService: AuthService;
  const auth = jest.fn();
  const authState$ = new BehaviorSubject<User | null>(null);

  beforeEach(async () => {
    jest.spyOn(fireAuth, 'authState').mockReturnValue(authState$);

    await MockBuilder(AuthService).provide({ provide: Auth, useValue: auth });

    authService = ngMocks.findInstance(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeDefined();
  });

  it('should handle null User', (done: jest.DoneCallback) => {
    authState$.next(null);

    authService.user$.pipe(first()).subscribe({
      next: (v) => {
        expect(v).toBeNull();
        done();
      },
      error: done.fail,
    });
  });

  it('should return an observable of the user', (done: jest.DoneCallback) => {
    authState$.next(mockUser as unknown as User);

    authService.user$.pipe(first()).subscribe({
      next: (v) => {
        expect(v).toEqual(mockUser);
        done();
      },
      error: done.fail,
    });
  });

  it('should call the popup opening method', (done: jest.DoneCallback) => {
    jest.spyOn(fireAuth, 'signInWithPopup').mockReturnValue(Promise.resolve({} as unknown as UserCredential));
    // angularFireAuth.setPersistence.and.returnValue(Promise.resolve());

    authService
      .signInWithGoogle()
      .pipe(first())
      .subscribe({
        next: () => {
          expect(fireAuth.signInWithPopup).toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
  });

  it('should call the popup opening method', (done: jest.DoneCallback) => {
    jest.spyOn(fireAuth, 'signInWithEmailAndPassword').mockReturnValue(Promise.resolve({} as unknown as UserCredential));
    // angularFireAuth.setPersistence.and.returnValue(Promise.resolve());

    authService
      .signInWithEmailAndPassword('test@test.fr', '123456')
      .pipe(first())
      .subscribe({
        next: () => {
          expect(fireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@test.fr', '123456');
          done();
        },
        error: done.fail,
      });
  });

  it('should call the sign method', () => {
    jest.spyOn(fireAuth, 'signOut').mockReturnValue(Promise.resolve());

    authService.signOut();

    expect(fireAuth.signOut).toHaveBeenCalled();
  });
});
