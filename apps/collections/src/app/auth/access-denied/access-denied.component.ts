import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'col-not-activate',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: 'access-denied.component.html',
  styleUrls: ['access-denied.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {}
