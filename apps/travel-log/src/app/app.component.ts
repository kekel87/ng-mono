import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { MapComponent } from './map/map.component';

@Component({
  standalone: true,
  imports: [HeaderComponent, SidenavComponent, FooterComponent, MapComponent, RouterOutlet],
  selector: 'log-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'travel-log';
}
