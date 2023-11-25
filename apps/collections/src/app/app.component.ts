import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './core/layout/header/header.component';
import { SidePanelComponent } from './core/layout/sidepanel/sidepanel.component';

@Component({
  selector: 'col-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidePanelComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
