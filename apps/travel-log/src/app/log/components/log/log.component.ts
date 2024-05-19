import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { FromGeoJsonDirective } from '../../../shared/directive/from-geojson.directive';
import { Log } from '../../models/log';

@Component({
  standalone: true,
  selector: 'log-header',
  imports: [DatePipe, DecimalPipe, MatCardHeader, MatIcon, MatCardTitle, MatCardSubtitle, FromGeoJsonDirective],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent {
  log = input.required<Log>();
}
