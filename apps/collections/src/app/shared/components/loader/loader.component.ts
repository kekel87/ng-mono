import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [MatProgressSpinnerModule],
  selector: 'col-loader',
  template: ` <mat-spinner [diameter]="diameter"></mat-spinner> `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input()
  diameter = 60;
}
