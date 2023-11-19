import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AutoFocusDirective } from '~shared/directives/auto-focus/auto-focus.directive';

import { layoutActions } from '../../layout.actions';
import * as layoutSelectors from '../../layout.selectors';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatToolbarModule, MatInputModule, AutoFocusDirective],
  selector: 'col-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  search$: Observable<string> = this.store.select(layoutSelectors.selectSearchPredicate);
  searchChange$: Subject<string> = new Subject<string>();

  constructor(private store: Store) {
    this.searchChange$.pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged()).subscribe((search) => {
      this.store.dispatch(layoutActions.search({ search }));
    });
  }

  close(): void {
    this.store.dispatch(layoutActions.closeSearchBar());
  }
}
