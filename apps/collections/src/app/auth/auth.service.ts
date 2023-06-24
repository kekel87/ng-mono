import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, authState, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth).pipe(
      map((user) =>
        user !== null
          ? ({
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
              email: user.email,
            } as User)
          : null
      )
    );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  signInWithGoogle() {
    // this.firebaseAuth.setPersistence('local')
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }
}
