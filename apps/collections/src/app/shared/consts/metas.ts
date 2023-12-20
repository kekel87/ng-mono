import { Collection } from '../enums/collection';
import { AmiiboMetaUtils } from '../utils/amiibo-meta';
import { BookMetaUtils } from '../utils/book-meta';
import { GameMetaUtils } from '../utils/game-meta';
import { MetaUtils } from '../utils/meta';
import { VinyleMetaUtils } from '../utils/vinyle-meta';

export const metas: { [collection: string]: typeof MetaUtils } = {
  [Collection.Games]: GameMetaUtils,
  [Collection.Amiibos]: AmiiboMetaUtils,
  [Collection.Books]: BookMetaUtils,
  [Collection.Vinyles]: VinyleMetaUtils,
};
