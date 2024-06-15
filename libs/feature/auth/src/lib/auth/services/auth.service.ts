import { Injectable } from '@angular/core';
import { AuthError, AuthTokenResponse, OAuthResponse, User } from '@supabase/supabase-js';
import { Observable, Subject, from } from 'rxjs';

import { SupabaseService } from '@ng-mono/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$ = new Subject<User | null>();
  private _error$ = new Subject<AuthError | null>();
  public user$ = this._user$.asObservable();
  public error$ = this._error$.asObservable();

  constructor(private supabase: SupabaseService) {}

  init(): void {
    this.supabase.auth.getUser().then(({ data, error }) => {
      this._user$.next(data && data.user && !error ? data.user : null);

      this.supabase.auth.onAuthStateChange((_authChangeEvent, session) => {
        this._user$.next(session?.user ?? null);
        this._error$.next(error);
      });
    });
  }

  signOut(): Observable<{ error: AuthError | null }> {
    return from(this.supabase.auth.signOut());
  }

  signInWithGoogle(): Observable<OAuthResponse> {
    return from(this.supabase.auth.signInWithOAuth({ provider: 'google' }));
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<AuthTokenResponse> {
    return from(this.supabase.auth.signInWithPassword({ email, password }));
  }
}
