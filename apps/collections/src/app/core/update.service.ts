import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store, createAction } from '@ngrx/store';

import { layoutActions } from './layout/layout.actions';
import { SnackbarOptions } from './layout/layout.models';

export const swUpdateAction = createAction('[SwUpdate] Active update');

@Injectable()
export class UpdateService {
  readonly snackbarOption: SnackbarOptions = {
    message: '⬆️ Update Available',
    action: 'Recharger',
    onAction: swUpdateAction(),
    config: { duration: 10000 },
  };

  constructor(
    private swUpdate: SwUpdate,
    private store: Store,
    private action$: ActionsSubject,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.swUpdate.versionUpdates.subscribe(() => {
      this.store.dispatch(layoutActions.openSnackbar({ options: this.snackbarOption }));
    });

    this.action$.pipe(ofType(swUpdateAction)).subscribe(() => this.updateSW());
  }

  updateSW(): void {
    this.swUpdate.activateUpdate().then(() => this.document.location.reload());
  }
}
