import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { MapComponent } from './map/map.component';

@Component({
  standalone: true,
  imports: [RouterModule, MapComponent, HeaderComponent, SidenavComponent, FooterComponent],
  selector: 'log-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'travel-log';
}
