import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { RequestState } from '@ng-mono/shared/utils';

import { mapActions } from '../../../map/store/map.actions';
import { Log } from '../../models/log';
import { logFeature } from '../../stores/log/log.feature';
import { logEntryFeature } from '../../stores/log-entry/log-entry.feature';
import { LogCardComponent } from '../log-card/log-card.component';

@Component({
  standalone: true,
  selector: 'log-logs',
  imports: [MatCard, MatIcon, MatButton, RouterLink, AsyncPipe, LogCardComponent],
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss'],
})
export class LogListComponent {
  protected readonly logs$ = this.store.select(logFeature.selectAll);
  protected readonly logEntryEntities$ = this.store.select(logEntryFeature.selectEntities);
  protected readonly RequestState = RequestState;

  constructor(private store: Store) {}

  protected fit(log: Log) {
    this.store.dispatch(mapActions.fit({ bbox: log.bbox }));
  }
}
