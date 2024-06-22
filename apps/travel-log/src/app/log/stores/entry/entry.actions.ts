import { createActionGroup, props } from '@ngrx/store';

import { Entry } from '../../models/entry';

export const entryActions = createActionGroup({
  source: 'Entry',
  events: {
    set: props<{ entry: Entry; logId: string }>(),

    load: props<{ id: string }>(),
    loadSuccess: props<{ entry: Entry }>(),
    loadError: props<{ id: string }>(),

    delete: props<{ id: string }>(),
    deleteSuccess: props<{ entry: Entry }>(),
    deleteError: props<{ id: string }>(),
  },
});
