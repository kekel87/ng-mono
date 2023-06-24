import { MetaUtils } from '~shared/utils/meta';

import { BookMetaUtils } from './book-meta';

export abstract class ComicMetaUtils extends MetaUtils {
  static override readonly title = 'BD - Manga';
  static override readonly icon = 'mms';
  static override readonly titleKey = 'title';
  static override readonly relations = [];

  static override newItem = BookMetaUtils.newItem;
  static override toItemsDisplay = BookMetaUtils.toItemsDisplay;
}
