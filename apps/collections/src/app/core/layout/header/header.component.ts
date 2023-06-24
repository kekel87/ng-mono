import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import * as layoutSelectors from '../layout.selectors';

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, SearchBarComponent],
  selector: 'col-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  showSearchBar$: Observable<boolean> = this.store.select(layoutSelectors.selectShowSearchBar);

  constructor(private store: Store) {}
}
