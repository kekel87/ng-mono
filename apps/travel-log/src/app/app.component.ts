import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';

@Component({
  standalone: true,
  imports: [RouterModule, MapComponent],
  selector: 'log-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'travel-log';
}
