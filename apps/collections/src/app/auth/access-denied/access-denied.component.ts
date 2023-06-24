import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'col-not-activate',
  templateUrl: 'access-denied.component.html',
  styleUrls: ['access-denied.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {}

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [AccessDeniedComponent],
  exports: [AccessDeniedComponent],
})
export class AccessDeniedModule {}
