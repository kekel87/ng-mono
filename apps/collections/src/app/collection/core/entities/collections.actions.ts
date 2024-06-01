import { createActionGroup, props } from '@ngrx/store';

import { Collection } from '~shared/enums/collection';
import { Item } from '~shared/models/item';

export const collectionsActions = createActionGroup({
  source: 'Collection',
  events: {
    init: props<{ collection: Collection }>(),
    initSuccess: props<{ collection: Collection }>(),
    dataChange: props<{ collection: Collection; items: Item[] }>(),
    save: props<{ collection: Collection; item: Partial<Item> | Item }>(),
    saveSuccess: props<{ collection: Collection }>(),
    delete: props<{ collection: Collection; id: string }>(),
    deleteSuccess: props<{ collection: Collection }>(),
    error: props<{ collection: Collection }>(),
  },
});
