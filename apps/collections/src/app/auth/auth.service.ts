import { Injectable } from '@angular/core';
import { AuthError, AuthTokenResponse, OAuthResponse } from '@supabase/supabase-js';
import { Observable, Subject, from } from 'rxjs';

import { SupabaseService } from '~shared/services/supabase.service';

import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$ = new Subject<User | null>();
  private _error$ = new Subject<AuthError | null>();
  public user$ = this._user$.asObservable();
  public error$ = this._error$.asObservable();

  constructor(private supabase: SupabaseService) {
    this.supabase.client.auth.getUser().then(({ data, error }) => {
      this._user$.next(data && data.user && !error ? data.user : null);

      this.supabase.client.auth.onAuthStateChange((_authChangeEvent, session) => {
        this._user$.next(session?.user ?? null);
        this._error$.next(error);
      });
    });
  }

  signOut(): Observable<{ error: AuthError | null }> {
    return from(this.supabase.client.auth.signOut());
  }

  signInWithGoogle(): Observable<OAuthResponse> {
    return from(this.supabase.client.auth.signInWithOAuth({ provider: 'google' }));
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<AuthTokenResponse> {
    return from(this.supabase.client.auth.signInWithPassword({ email, password }));
  }
}
