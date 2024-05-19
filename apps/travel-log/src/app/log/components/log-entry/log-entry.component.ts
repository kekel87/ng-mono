import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemMeta } from '@angular/material/list';

import { FromGeoJsonDirective } from '../../../shared/directive/from-geojson.directive';
import { LogEntrySave } from '../../models/log-entry';

@Component({
  standalone: true,
  selector: 'log-entry',
  imports: [DecimalPipe, DatePipe, MatIcon, MatListItem, FromGeoJsonDirective, MatIconButton, MatListItemMeta],
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.scss'],
})
export class LogEntryComponent {
  entry = input.required<LogEntrySave>();

  delete = output();
}
