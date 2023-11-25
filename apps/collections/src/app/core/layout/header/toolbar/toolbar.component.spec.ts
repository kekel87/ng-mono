import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { layoutActions } from '~app/core/layout/layout.actions';

import { ToolbarComponent } from './toolbar.component';
import { layoutFeature } from '../../layout.feature';

describe('ToolbarComponent', () => {
  let fixture: MockedComponentFixture<ToolbarComponent>;
  let store: MockStore;

  const config = {
    title: 'Test_title',
    actions: [
      { icon: 'filter_list', onAction: { type: 'Fake action 1' } },
      { icon: 'search', onAction: { type: 'Fake action 2' }, color: 'blue' },
      { icon: 'empty', color: 'red' },
    ],
  };

  beforeEach(async () => {
    await MockBuilder(ToolbarComponent).provide(
      provideMockStore({
        selectors: [{ selector: layoutFeature.selectToolbarConfig, value: config }],
      })
    );

    fixture = MockRender(ToolbarComponent);

    store = ngMocks.findInstance(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should set display config', () => {
    expect(ngMocks.formatText(ngMocks.find('h1'))).toBe(config.title);
    expect(ngMocks.findAll('button').length).toBe(3);
    expect(ngMocks.formatText(ngMocks.find('mat-toolbar > mat-icon'))).toEqual('empty');
    expect(ngMocks.find('button:nth-of-type(3)').attributes['style']).toEqual('color: blue;');
    expect(ngMocks.find('mat-toolbar > mat-icon').attributes['style']).toEqual('color: red;');
  });

  it('should call onAction when click on it', () => {
    ngMocks.click('button:nth-of-type(2)');
    expect(store.dispatch).toHaveBeenCalledWith(config.actions[0].onAction as Action);
    expect(store.dispatch).not.toHaveBeenCalledWith(config.actions[1].onAction as Action);
  });

  it('should dispatch ToggleSidenav', () => {
    ngMocks.click('button:nth-of-type(1)');
    expect(store.dispatch).toHaveBeenCalledWith(layoutActions.toggleSidenav());
  });
});
