import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { FullPageLoaderComponent } from '@ng-mono/shared/ui';
import { RequestState } from '@ng-mono/shared/utils';
import { AutoFocusDirective } from '~shared/directives/auto-focus/auto-focus.directive';

@Component({
  selector: 'col-custom-url-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FullPageLoaderComponent,
    AutoFocusDirective,
  ],
  templateUrl: './custom-url-dialog.component.html',
  styleUrls: ['./custom-url-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomUrlDialogComponent {
  url$: Observable<string>;
  urlChange$: Subject<string> = new Subject<string>();
  requestState$ = new BehaviorSubject<RequestState>(RequestState.Initial);
  readonly RequestState = RequestState;

  constructor() {
    this.url$ = this.urlChange$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.requestState$.next(RequestState.Loading))
    );
  }
}
