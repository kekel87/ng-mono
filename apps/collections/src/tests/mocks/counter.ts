import { Collection } from '~shared/enums/collection';

export abstract class MockCounter {
  static readonly base: Partial<Record<Collection, number>> = {
    [Collection.Games]: 2,
    [Collection.Amiibos]: 4,
    [Collection.Books]: 6,
    [Collection.Vinyles]: 1,
  };
}
