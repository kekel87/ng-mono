import { Dictionary } from '@ngrx/entity';

import { Collection } from '~shared/enums/collection';
import { Item } from '~shared/models/item';
import { ItemToDisplay } from '~shared/models/item-to-display';

export abstract class MetaUtils {
  static readonly title: string;
  static readonly icon: string;
  static readonly titleKey: string;
  static readonly relations: Collection[];

  static newItem: (id: string) => Item;
  static toItemsDisplay: (data: Item[] | (Item[] | Dictionary<Item>)[]) => ItemToDisplay[];
}
