import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { Observable } from 'rxjs';

import { routerActions } from '@ng-mono/shared/utils';
import { layoutActions } from '~app/core/layout/layout.actions';
import { Collection } from '~shared/enums/collection';

import { collectionDetailActions } from './detail.actions';
import { DetailEffects } from './detail.effects';
import { collectionsActions } from '../../../core/entities/collections.actions';

describe('DetailEffects', () => {
  let effects: DetailEffects;
  let actions$: Observable<Action>;

  beforeEach(async () => {
    await MockBuilder(DetailEffects)
      .provide(provideMockActions(() => actions$))
      .provide(provideMockStore());

    effects = ngMocks.findInstance(DetailEffects);
  });

  describe('goToList$', () => {
    it('should navigate to game list after delete game', () => {
      actions$ = hot('-a-', {
        a: collectionsActions.deleteSuccess({ collection: Collection.Games }),
      });
      const expected = cold('-a-', {
        a: routerActions.navigate({ commands: ['/', Collection.Games] }),
      });
      expect(effects.goToList$).toBeObservable(expected);
    });
  });

  describe('navigateWhenNotFound$', () => {
    it('should navigate to game list if game not found', () => {
      actions$ = hot('-a-', {
        a: collectionDetailActions.notFound({ collection: Collection.Amiibos }),
      });

      const expected = cold('-a-', {
        a: routerActions.navigate({ commands: ['/', Collection.Amiibos] }),
      });
      expect(effects.navigateWhenNotFound$).toBeObservable(expected);
    });
  });

  describe('showMessageWhenNotFound$', () => {
    it('should navigate to game list and open snack bar if game not found', () => {
      actions$ = hot('-a-', {
        a: collectionDetailActions.notFound({ collection: Collection.Amiibos }),
      });
      const expected = cold('-a-', {
        a: layoutActions.openSnackbar({
          options: {
            message: '⚠ Element non trouvé !',
            action: 'OK',
          },
        }),
      });
      expect(effects.showMessageWhenNotFound$).toBeObservable(expected);
    });
  });
});
