import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { layoutFeature } from '../layout.feature';

@Component({
  selector: 'col-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, ToolbarComponent, SearchBarComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  showSearchBar$: Observable<boolean> = this.store.select(layoutFeature.selectShowSearchBar);

  constructor(private store: Store) {}
}
