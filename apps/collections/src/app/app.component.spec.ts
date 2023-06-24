import { RouterModule } from '@angular/router';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { AppComponent } from '~app/app.component';

import { HeaderComponent } from './core/layout/header/header.component';
import { SidePanelComponent } from './core/layout/sidepanel/sidepanel.component';

describe('AppComponent', () => {
  let fixture: MockedComponentFixture<AppComponent>;

  beforeEach(async () => {
    await MockBuilder(AppComponent).mock(RouterModule).mock(HeaderComponent).mock(SidePanelComponent);
    fixture = MockRender(AppComponent);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should have header', () => {
    expect(ngMocks.find('col-header', null)).not.toBeNull();
  });

  it('should have sidepanel', () => {
    expect(ngMocks.find('col-sidepanel', null)).not.toBeNull();
  });

  it('should have router-outlet', () => {
    expect(ngMocks.find('router-outlet', null)).not.toBeNull();
  });
});
