import { Counter } from '~app/dashboard/store/counter/counter.model';

export abstract class MockCounter {
  static readonly all: Counter[] = [
    { count: 2, id: 'games' },
    { count: 4, id: 'amiibos' },
    { count: 6, id: 'books' },
    { count: 1, id: 'vinyles' },
    { count: 0, id: 'comics' },
  ];
}
