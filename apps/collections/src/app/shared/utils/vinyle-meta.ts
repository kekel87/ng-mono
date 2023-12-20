import { Dictionary } from '@ngrx/entity';

import { toPredicate } from '@ng-mono/shared';

import { MetaUtils } from './meta';
import { Item } from '../models/item';
import { ItemToDisplay } from '../models/item-to-display';
import { Vinyle } from '../models/vinyle';

export abstract class VinyleMetaUtils extends MetaUtils {
  static override readonly title = 'Vinyles';
  static override readonly icon = 'album';
  static override readonly titleKey = 'title';
  static override readonly relations = [];

  static override newItem(id: string): Item {
    return { id, cover: null, acquired: false } as Item;
  }

  static override toItemsDisplay(data: Item[] | (Item[] | Dictionary<Item>)[]): ItemToDisplay[] {
    return (data as Vinyle[]).map((vinyle) => ({
      id: vinyle.id,
      title: vinyle.title,
      subTitle: vinyle.artist,
      acquired: vinyle.acquired,
      image: vinyle.cover,
      predicate: VinyleMetaUtils.predicate(vinyle),
    }));
  }

  private static predicate(vinyle: Vinyle): string {
    const s = vinyle.acquired ? 'acquis' : 'recherche-voulu';
    return toPredicate(`${vinyle.title}-${vinyle.artist}-${s}`);
  }
}
