import { Component } from '@angular/core';

import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { LogsComponent } from './logs/logs.component';
import { MapComponent } from './map/map.component';

@Component({
  standalone: true,
  imports: [HeaderComponent, SidenavComponent, FooterComponent, MapComponent, LogsComponent],
  selector: 'log-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'travel-log';
}
