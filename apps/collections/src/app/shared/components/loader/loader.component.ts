import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'col-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: ` <mat-spinner [diameter]="diameter"></mat-spinner> `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input()
  diameter = 60;
}
