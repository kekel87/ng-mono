import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { AutoFocusDirective } from '~shared/directives/auto-focus/auto-focus.directive';
import { RequestState } from '~shared/enums/request-state';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    LoaderComponent,
    AutoFocusDirective,
  ],
  selector: 'col-custom-url-dialog',
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
