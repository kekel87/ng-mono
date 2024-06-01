import { createActionGroup, props } from '@ngrx/store';

export const collectionListActions = createActionGroup({
  source: 'CollectionList',
  events: {
    saveScrollIndex: props<{ scrollIndex: number }>(),
  },
});
