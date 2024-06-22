import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RequestState } from '@ng-mono/shared/utils';
import { Store } from '@ngrx/store';

import { entryFeature } from '../../stores/entry/entry.feature';
import { logFeature } from '../../stores/log/log.feature';
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
  protected readonly logEntryEntities$ = this.store.select(entryFeature.selectEntities);
  protected readonly RequestState = RequestState;

  constructor(private store: Store) {}
}
