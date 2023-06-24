import { DOCUMENT } from '@angular/common';
import { fakeAsync, flush } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Subject } from 'rxjs';

import { layoutActions } from './layout/layout.actions';
import { swUpdateAction, UpdateService } from './update.service';

describe('UpdateService', () => {
  let service: UpdateService;
  let store: MockStore;

  let document: Document;
  const availableSubject = new Subject<VersionEvent>();

  beforeEach(async () => {
    await MockBuilder(UpdateService)
      .provide(provideMockStore())
      .provide({
        provide: SwUpdate,
        useValue: {
          versionUpdates: availableSubject,
          activateUpdate: () => Promise.resolve(),
        },
      })
      .provide({
        provide: DOCUMENT,
        useValue: {
          location: {
            reload: jest.fn(),
          },
          querySelectorAll: () => [],
        },
      });

    service = ngMocks.findInstance(UpdateService);
    store = ngMocks.findInstance(MockStore);
    document = ngMocks.findInstance(DOCUMENT);
    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should open Sackbar when update is available', () => {
    availableSubject.next({
      type: 'VERSION_DETECTED',
      version: { hash: 'hash' },
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      layoutActions.openSnackbar({
        options: {
          message: '⬆️ Update Available',
          action: 'Recharger',
          onAction: swUpdateAction(),
          config: {
            duration: 10000,
          },
        },
      })
    );
  });

  it('should refresh page', fakeAsync(() => {
    store.dispatch(swUpdateAction());
    flush();
    expect(document.location.reload).toHaveBeenCalled();
  }));
});
