import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Collection } from '~shared/enums/collection';
import { SaveState } from '~shared/enums/save-state';

export const collectionDetailActions = createActionGroup({
  source: 'CollectionDetail',
  events: {
    'Open delete popup': emptyProps(),
    'Set Save State': props<{ saveState: SaveState }>(),
    'Not Found': props<{ collection: Collection }>(),
  },
});
