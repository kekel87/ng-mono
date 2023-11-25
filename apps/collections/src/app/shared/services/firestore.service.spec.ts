import { CollectionReference, DocumentData, DocumentReference, Firestore } from '@angular/fire/firestore';
import * as fireFirestore from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { authFeature } from '~app/auth/auth.feature';
import { AuthService } from '~app/auth/auth.service';
import { FirestoreService } from '~shared/services/firestore.service';
import { mockUser } from '~tests/mocks/user';

jest.mock('@angular/fire/firestore');

describe('FirestoreService', () => {
  let service: FirestoreService;
  let store: Store;

  const firestore = jest.fn();
  const entityNoId = { name: 'Entity No ID', acquired: true };
  const entity = { ...entityNoId, id: 'uid1' };
  const documentReference = { id: '123456' } as DocumentReference<DocumentData>;
  const collectionReference = {} as CollectionReference<DocumentData>;

  beforeEach(async () => {
    await MockBuilder(AuthService)
      .provide({ provide: Firestore, useValue: firestore })
      .provide(provideMockStore({ selectors: [{ selector: authFeature.selectUser, value: mockUser }] }));

    service = ngMocks.findInstance(FirestoreService);
    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');

    jest.spyOn(fireFirestore, 'doc').mockReturnValue(documentReference);
    jest.spyOn(fireFirestore, 'collection').mockReturnValue(collectionReference);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should create an id', () => {
    expect(service.createId()).toEqual(`123456`);
    expect(fireFirestore.collection).toHaveBeenCalledWith(firestore, '_');
    expect(fireFirestore.doc as jasmine.Spy).toHaveBeenCalledWith(collectionReference);
  });

  it('should find entity by id', () => {
    jest.spyOn(fireFirestore, 'docData').mockReturnValue(cold('a', { a: entityNoId }));

    expect(service.findById('entityCollectionName', 'uid1')).toBeObservable(cold('a', { a: entity }));
    expect(fireFirestore.doc).toHaveBeenCalledWith(firestore, `entityCollectionName/uid1`);
    expect(fireFirestore.docData).toHaveBeenCalledWith(documentReference);
  });

  it('should return undefined if entity not found by id', () => {
    jest.spyOn(fireFirestore, 'docData').mockReturnValue(cold('a', { a: undefined }));

    expect(service.findById('entityCollectionName', 'uid1')).toBeObservable(cold('a', { a: undefined }));
    expect(fireFirestore.doc).toHaveBeenCalledWith(firestore, `entityCollectionName/uid1`);
    expect(fireFirestore.docData).toHaveBeenCalledWith(documentReference);
  });

  it('should get change of an collection', () => {
    jest.spyOn(fireFirestore, 'collectionData').mockReturnValue(cold('a', { a: [entity] }));

    expect(service.onChange('entityCollectionName')).toBeObservable(cold('a', { a: [entity] }));
    expect(fireFirestore.collection).toHaveBeenCalledWith(firestore, `entityCollectionName`);
    expect(fireFirestore.collectionData).toHaveBeenCalledWith(collectionReference, { idField: 'id' });
  });

  it('should save entity', () => {
    // jest.spyOn(fireFirestore, 'setDoc').mockImplementation(() => Promise.resolve());
    jest.spyOn(fireFirestore, 'setDoc').mockReturnValue(cold('a') as unknown as Promise<void>);

    expect(service.save('entityCollectionName', entity)).toBeObservable(cold('a', { a: entity.id }));
    expect(fireFirestore.doc).toHaveBeenCalledWith(firestore, `entityCollectionName/uid1`);
    expect(fireFirestore.setDoc).toHaveBeenCalledWith(documentReference, entityNoId, { merge: true });
  });

  it('should delete entity', () => {
    // jest.spyOn(fireFirestore, 'deleteDoc').mockImplementation(() => Promise.resolve());
    jest.spyOn(fireFirestore, 'deleteDoc').mockReturnValue(cold('a') as unknown as Promise<void>);

    expect(service.delete('entityCollectionName', 'uid1')).toBeObservable(cold('a'));
    expect(fireFirestore.doc).toHaveBeenCalledWith(firestore, `entityCollectionName/uid1`);
    expect(fireFirestore.deleteDoc).toHaveBeenCalledWith(documentReference);
  });
});
