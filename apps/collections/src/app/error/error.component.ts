import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'col-error',
  standalone: true,
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {}
