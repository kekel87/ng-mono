import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatList } from '@angular/material/list';
import { Store } from '@ngrx/store';

import { RequestState } from '@ng-mono/shared/utils';

import { mapActions } from '../../../map/store/map.actions';
import { Log } from '../../models/log';
import { LogEntry } from '../../models/log-entry';
import { LogComponent } from '../log/log.component';
import { LogEntryComponent } from '../log-entry/log-entry.component';

@Component({
  standalone: true,
  selector: 'log-card',
  imports: [
    AsyncPipe,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatChipListbox,
    MatChipOption,
    MatDivider,
    MatExpansionPanel,
    MatExpansionPanelContent,
    MatExpansionPanelHeader,
    MatIcon,
    MatIconButton,
    MatList,
    LogComponent,
    LogEntryComponent,
  ],
  templateUrl: './log-card.component.html',
  styleUrls: ['./log-card.component.scss'],
})
export class LogCardComponent {
  log = input.required<Log>();
  entries = input.required<LogEntry[]>();

  protected readonly RequestState = RequestState;

  constructor(private store: Store) {}

  protected fit() {
    this.store.dispatch(mapActions.fit({ bbox: this.log().bbox }));
  }
}
