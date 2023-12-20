import { createActionGroup, props } from '@ngrx/store';

import { Collection } from '~shared/enums/collection';
import { Item } from '~shared/models/item';

export const collectionsActions = createActionGroup({
  source: 'Collection',
  events: {
    init: props<{ collection: Collection }>(),
    'Init success': props<{ collection: Collection }>(),
    'Data change': props<{ collection: Collection; items: Item[] }>(),
    save: props<{ collection: Collection; item: Partial<Item> | Item }>(),
    'Save success': props<{ collection: Collection }>(),
    delete: props<{ collection: Collection; id: string }>(),
    'Delete Success': props<{ collection: Collection }>(),
    error: props<{ collection: Collection }>(),
  },
});
