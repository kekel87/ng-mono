import { Dictionary } from '@ngrx/entity';

import { toPredicate } from '@ng-mono/shared/utils';
import { Amiibo } from '~shared/models/amiibo';
import { Item } from '~shared/models/item';
import { ItemToDisplay } from '~shared/models/item-to-display';

import { MetaUtils } from './meta';

export abstract class AmiiboMetaUtils extends MetaUtils {
  static override readonly title = 'Amiibo';
  static override readonly icon = 'accessibility';
  static override readonly titleKey = 'character';
  static override readonly relations = [];

  static override newItem(id: string): Item {
    return { id, image: null, acquired: false } as Item;
  }

  static override toItemsDisplay(data: Item[] | (Item[] | Dictionary<Item>)[]): ItemToDisplay[] {
    return (data as Amiibo[]).map((amiibo) => ({
      id: amiibo.id,
      title: amiibo.character,
      subTitle: amiibo.serie,
      acquired: amiibo.acquired,
      image: amiibo.image,
      predicate: AmiiboMetaUtils.predicate(amiibo),
    }));
  }

  private static predicate(amiibo: Amiibo): string {
    const s = amiibo.acquired ? 'acquis' : 'recherche-voulu';
    return toPredicate(`${amiibo.character}-${amiibo.serie}-${amiibo.comment}-${s}`);
  }
}
