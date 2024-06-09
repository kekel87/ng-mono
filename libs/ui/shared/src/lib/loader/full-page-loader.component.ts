import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'full-page-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: ` <mat-spinner [diameter]="diameter()" />`,
  styleUrls: ['./full-page-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullPageLoaderComponent {
  diameter = input(60);
}
