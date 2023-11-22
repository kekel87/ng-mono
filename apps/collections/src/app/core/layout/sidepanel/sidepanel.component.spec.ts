import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLinkWithHref } from '@angular/router';
import { ActionsSubject } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { Subject } from 'rxjs';

import { authActions } from '~app/auth/auth.actions';
import * as authSelectors from '~app/auth/auth.selectors';
import { layoutActions } from '~app/core/layout/layout.actions';
import { SnackbarOptions } from '~app/core/layout/layout.models';
import { SidePanelComponent } from '~app/core/layout/sidepanel/sidepanel.component';
import { Collection } from '~shared/enums/collection';
import { RouteName } from '~shared/enums/route-name';
import { mockUser } from '~tests/mocks/user';

import * as layoutSelectors from '../layout.selectors';

describe('SidePanelComponent', () => {
  let fixture: MockedComponentFixture<SidePanelComponent>;
  let store: MockStore;
  const snackBar = { open: jest.fn() };
  const snackBarRef = { onAction: jest.fn() };
  const breakpointObserver = { observe: jest.fn() };
  const breakpointState$ = new Subject<BreakpointState>();

  beforeEach(async () => {
    breakpointObserver.observe.mockReturnValue(breakpointState$);

    await MockBuilder(SidePanelComponent)
      .provide({ provide: MatSnackBar, useValue: snackBar })
      .provide({ provide: BreakpointObserver, useValue: breakpointObserver })
      .provide(
        provideMockStore({
          selectors: [
            { selector: layoutSelectors.selectShowSidenav, value: null },
            { selector: authSelectors.selectUser, value: mockUser },
          ],
        })
      );

    fixture = MockRender(SidePanelComponent);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display user', () => {
    expect(ngMocks.find('img').properties['src']).toEqual(mockUser.photoURL);
    expect(ngMocks.formatText(ngMocks.find('.name'))).toEqual(mockUser.displayName);
    expect(ngMocks.formatText(ngMocks.find('.email'))).toEqual(mockUser.email);
  });

  it('should nav list links', () => {
    expect(ngMocks.findInstances('mat-nav-list a', RouterLinkWithHref).map(({ routerLink }) => routerLink)).toEqual([
      ['/', RouteName.Dashboard],
      ['/', Collection.Games],
      ['/', Collection.Comics],
      ['/', Collection.Amiibos],
      ['/', Collection.Books],
      ['/', Collection.Vinyles],
    ]);
  });

  it('should close sidenav', () => {
    ngMocks.click('mat-nav-list a:first-of-type');
    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.toggleSidenav());
  });

  it('should open a snackbar', () => {
    const actions = ngMocks.findInstance(ActionsSubject);
    const options: SnackbarOptions = {
      message: 'Test message',
      action: 'OK',
      onAction: { type: 'Fake Action' },
    };

    snackBarRef.onAction.mockReturnValue(hot('a|'));
    snackBar.open.mockReturnValue(snackBarRef);
    store.dispatch(layoutActions.openSnackbar({ options }));

    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(options.message, options.action, undefined);
    const expected = cold('(ab)', { a: layoutActions.openSnackbar({ options }), b: options.onAction });
    expect(actions).toBeObservable(expected);
  });

  it('should handle empty snackbar action', () => {
    const actions = ngMocks.findInstance(ActionsSubject);
    const options: SnackbarOptions = {
      message: 'Test message',
      action: 'OK',
    };

    snackBarRef.onAction.mockReturnValue(cold('a|'));
    snackBar.open.mockReturnValue(snackBarRef);
    store.dispatch(layoutActions.openSnackbar({ options }));

    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(options.message, options.action, undefined);
    const expected = cold('a', { a: layoutActions.openSnackbar({ options }) });
    expect(actions).toBeObservable(expected);
  });

  it('should dispatch Logout', () => {
    ngMocks.click('.user button');
    expect(store.dispatch).toHaveBeenCalledWith(authActions.logout());
  });
});
