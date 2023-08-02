import { DatePipe, NgForOf, NgIf, AsyncPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';

import 'leaflet-gpx';

import { RequestState } from '@ng-mono/shared';

import { FromGeoJsonDirective } from '../shared/directive/from-geojson.directive';
import { LogObject } from '../shared/models/log-object';
import { logEntryObjectFeature } from '../shared/stores/log-entry-object/log-entry-object.feature';
import { logObjectFeature } from '../shared/stores/log-object/log-object.feature';
import { mapActions } from '../shared/stores/map/map.actions';

@Component({
  standalone: true,
  selector: 'log-logs',
  imports: [
    AsyncPipe,
    DecimalPipe,
    NgIf,
    NgForOf,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    FromGeoJsonDirective,
  ],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent {
  protected readonly logs$ = this.store.select(logObjectFeature.selectAll);
  protected readonly logEntryEntities$ = this.store.select(logEntryObjectFeature.selectEntities);
  protected readonly RequestState = RequestState;

  constructor(private store: Store) {}

  fit(log: LogObject) {
    this.store.dispatch(mapActions.fit({ bbox: log.bbox }));
  }
}
