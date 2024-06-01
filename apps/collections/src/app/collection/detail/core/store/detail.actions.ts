import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Collection } from '~shared/enums/collection';
import { SaveState } from '~shared/enums/save-state';

export const collectionDetailActions = createActionGroup({
  source: 'CollectionDetail',
  events: {
    openDeletePopup: emptyProps(),
    setSaveState: props<{ saveState: SaveState }>(),
    notFound: props<{ collection: Collection }>(),
  },
});
