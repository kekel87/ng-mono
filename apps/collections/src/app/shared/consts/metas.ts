import { Collection } from '../enums/collection';
import { AmiiboMetaUtils } from '../utils/amiibo-meta';
import { BookMetaUtils } from '../utils/book-meta';
import { ComicMetaUtils } from '../utils/comic-meta';
import { GameMetaUtils } from '../utils/game-meta';
import { MetaUtils } from '../utils/meta';
import { VinyleMetaUtils } from '../utils/vinyle-meta';

export const metas: { [collection: string]: typeof MetaUtils } = {
  [Collection.Games]: GameMetaUtils,
  [Collection.Comics]: ComicMetaUtils,
  [Collection.Amiibos]: AmiiboMetaUtils,
  [Collection.Books]: BookMetaUtils,
  [Collection.Vinyles]: VinyleMetaUtils,
};
