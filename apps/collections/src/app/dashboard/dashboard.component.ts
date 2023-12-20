import { AsyncPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { original } from '@ng-mono/shared';
import { metas } from '~shared/consts/metas';

@Component({
  selector: 'col-dashboard',
  standalone: true,
  imports: [AsyncPipe, KeyValuePipe, NgIf, NgForOf, RouterLink, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  counters$ = this.route.data.pipe(map(({ counter }) => counter || {}));

  readonly metas = metas;
  readonly originalOrder = original;

  constructor(private route: ActivatedRoute) {}
}
