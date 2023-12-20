import { MockBuilder, ngMocks } from 'ng-mocks';
import { first } from 'rxjs/operators';

import { SupabaseService } from '~shared/services/supabase.service';
import { mockUser } from '~tests/mocks/user';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let callback: (event: unknown, session: unknown) => void | Promise<void>;
  const supabaseService = {
    client: {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        onAuthStateChange: jest.fn((cb) => (callback = cb)),
        signOut: jest.fn(),
        signInWithOAuth: jest.fn(),
        signInWithPassword: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    await MockBuilder(AuthService).provide({ provide: SupabaseService, useValue: supabaseService });

    authService = ngMocks.findInstance(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeDefined();
  });

  it('should return an observable of the user', (done: jest.DoneCallback) => {
    authService.user$.pipe(first()).subscribe({
      next: (v) => {
        expect(v).toEqual(mockUser);
        done();
      },
      error: done.fail,
    });

    callback(null, { user: mockUser });
  });

  it('should sign-in with google', (done: jest.DoneCallback) => {
    supabaseService.client.auth.signInWithOAuth.mockResolvedValue({});

    authService
      .signInWithGoogle()
      .pipe(first())
      .subscribe({
        next: () => {
          expect(supabaseService.client.auth.signInWithOAuth).toHaveBeenCalledWith({ provider: 'google' });
          done();
        },
        error: done.fail,
      });
  });

  it('should sign-in with email and password', (done: jest.DoneCallback) => {
    supabaseService.client.auth.signInWithPassword.mockResolvedValue({});

    authService
      .signInWithEmailAndPassword('test@test.fr', '123456')
      .pipe(first())
      .subscribe({
        next: () => {
          expect(supabaseService.client.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@test.fr', password: '123456' });
          done();
        },
        error: done.fail,
      });
  });

  it('should call the sign method', () => {
    supabaseService.client.auth.signOut.mockReturnValue(Promise.resolve());

    authService.signOut();

    expect(supabaseService.client.auth.signOut).toHaveBeenCalled();
  });
});
