import { MockBuilder, ngMocks } from 'ng-mocks';
import { first } from 'rxjs/operators';

import { SupabaseService } from '@ng-mono/shared/utils';

import { AuthService } from './auth.service';
import { mockUser } from '../../../../testing/mocks/user';

describe('AuthService', () => {
  let authService: AuthService;
  const supabaseService = {
    auth: {
      onAuthStateChange: jest.fn((callback) => callback(undefined, { user: mockUser })),
      signOut: jest.fn(),
      signInWithOAuth: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  };

  beforeEach(async () => {
    await MockBuilder(AuthService).provide({ provide: SupabaseService, useValue: supabaseService });

    authService = ngMocks.findInstance(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeDefined();
  });

  it('should return an observable of the user after init', (done: jest.DoneCallback) => {
    authService.user$.pipe(first()).subscribe({
      next: (user) => {
        expect(user).toEqual(mockUser);
        done();
      },
      error: done.fail,
    });

    authService.init();
  });

  it('should sign-in with google', (done: jest.DoneCallback) => {
    supabaseService.auth.signInWithOAuth.mockResolvedValue({});

    authService
      .signInWithGoogle()
      .pipe(first())
      .subscribe({
        next: () => {
          expect(supabaseService.auth.signInWithOAuth).toHaveBeenCalledWith({ provider: 'google' });
          done();
        },
        error: done.fail,
      });
  });

  it('should sign-in with email and password', (done: jest.DoneCallback) => {
    supabaseService.auth.signInWithPassword.mockResolvedValue({});

    authService
      .signInWithEmailAndPassword('test@test.fr', '123456')
      .pipe(first())
      .subscribe({
        next: () => {
          expect(supabaseService.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@test.fr', password: '123456' });
          done();
        },
        error: done.fail,
      });
  });

  it('should call the sign method', () => {
    supabaseService.auth.signOut.mockReturnValue(Promise.resolve());

    authService.signOut();

    expect(supabaseService.auth.signOut).toHaveBeenCalled();
  });
});
