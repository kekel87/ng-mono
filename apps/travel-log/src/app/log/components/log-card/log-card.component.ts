import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatList } from '@angular/material/list';
import { RequestState } from '@ng-mono/shared/utils';
import { Store } from '@ngrx/store';
import { BBox } from 'geojson';

import { mapActions } from '../../../map/store/map.actions';
import { Entry } from '../../models/entry';
import { Log } from '../../models/log';
import { EntryComponent } from '../entry/entry.component';
import { LogComponent } from '../log/log.component';

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
    EntryComponent,
  ],
  templateUrl: './log-card.component.html',
  styleUrls: ['./log-card.component.scss'],
})
export class LogCardComponent {
  log = input.required<Log>();
  entries = input.required<Entry[]>();

  protected readonly RequestState = RequestState;

  constructor(private store: Store) {}

  protected fit(bbox: BBox) {
    this.store.dispatch(mapActions.fit({ bbox }));
  }
}
