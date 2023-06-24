import { createActionGroup, props } from '@ngrx/store';

export const collectionListActions = createActionGroup({
  source: 'CollectionList',
  events: {
    'Save scroll index': props<{ scrollIndex: number }>(),
  },
});
