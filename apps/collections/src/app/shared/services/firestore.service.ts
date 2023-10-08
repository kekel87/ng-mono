import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import * as authSelectors from '~app/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private firestore: Firestore,
    private store: Store
  ) {}

  createId(): string {
    return doc(collection(this.firestore, '_')).id;
  }

  findById<T>(collection: string, id: string): Observable<T | undefined> {
    const docRef = doc(this.firestore, `${collection}/${id}`) as DocumentReference<Partial<T>>;
    return docData(docRef).pipe(map((doc) => (doc === undefined ? undefined : Object.assign({}, doc as T, { id }))));
  }

  onChange<T extends { id: string }>(col: string): Observable<T[]> {
    const colRef = collection(this.firestore, col) as CollectionReference<T>;
    return collectionData(colRef, { idField: 'id' }).pipe(takeUntil(this.store.select(authSelectors.selectUser).pipe(filter((u) => !u))));
  }

  save<T extends { id: string }>(collection: string, data: Partial<T>): Observable<string> {
    const { id, ...docWithNoId } = data as T & { id: string };
    const docRef = doc(this.firestore, `${collection}/${id}`) as DocumentReference<Partial<T>>;
    return from(setDoc(docRef, docWithNoId as T, { merge: true })).pipe(map(() => id));
  }

  delete(collection: string, id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, `${collection}/${id}`)));
  }
}
