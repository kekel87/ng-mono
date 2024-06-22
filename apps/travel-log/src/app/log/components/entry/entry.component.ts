import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemMeta } from '@angular/material/list';

import { FromGeoJsonDirective } from '../../../shared/directive/from-geojson.directive';
import { EntrySave } from '../../models/entry';

@Component({
  standalone: true,
  selector: 'log-entry',
  imports: [DecimalPipe, DatePipe, MatIcon, MatListItem, FromGeoJsonDirective, MatIconButton, MatListItemMeta],
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent {
  entry = input.required<EntrySave>();

  delete = output();
}
