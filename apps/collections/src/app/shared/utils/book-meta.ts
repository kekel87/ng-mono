import { Dictionary } from '@ngrx/entity';

import { Book } from '~shared/models/book';
import { Item } from '~shared/models/item';
import { ItemToDisplay } from '~shared/models/item-to-display';
import { toPredicate } from '~shared/utils/string';

import { MetaUtils } from './meta';

export abstract class BookMetaUtils extends MetaUtils {
  static override readonly title = 'Livre';
  static override readonly icon = 'import_contacts';
  static override readonly titleKey = 'title';
  static override readonly relations = [];

  static override newItem(id: string): Item {
    return {
      id,
      image: 'assets/400x200.png',
      acquired: false,
      tomes: [],
      authors: [null],
    } as Item;
  }

  static override toItemsDisplay(data: Item[] | (Item[] | Dictionary<Item>)[]): ItemToDisplay[] {
    return (data as Book[]).map((book) => ({
      id: book.id,
      title: book.title,
      subTitle: `${book.publisher} - ${book.authors.join(', ')}`,
      acquired: book.acquired,
      image: book.image,
      predicate: BookMetaUtils.predicate(book),
    }));
  }

  private static predicate(book: Book): string {
    const s = book.acquired ? 'acquis' : 'recherche-voulu';
    return toPredicate(`${book.title}-${book.publisher}-${book.authors.join('-')}-${s}`);
  }
}
