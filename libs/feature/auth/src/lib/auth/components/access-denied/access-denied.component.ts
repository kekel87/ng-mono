import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatIcon],
  templateUrl: 'access-denied.component.html',
  styleUrls: ['access-denied.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {}
