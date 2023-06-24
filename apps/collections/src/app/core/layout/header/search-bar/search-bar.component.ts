import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AutoFocusDirective } from '~shared/directives/auto-focus/auto-focus.directive';

import { layoutActions } from '../../layout.actions';
import * as layoutSelectors from '../../layout.selectors';

@UntilDestroy()
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
    this.searchChange$.pipe(untilDestroyed(this), debounceTime(200), distinctUntilChanged()).subscribe((search) => {
      this.store.dispatch(layoutActions.search({ search }));
    });
  }

  close(): void {
    this.store.dispatch(layoutActions.closeSearchBar());
  }
}
