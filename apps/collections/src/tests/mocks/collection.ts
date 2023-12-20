import { BookType } from '~shared/enums/book-type';
import { Amiibo } from '~shared/models/amiibo';
import { Book } from '~shared/models/book';
import { Console } from '~shared/models/console';
import { Game } from '~shared/models/game';
import { Item } from '~shared/models/item';
import { Tome } from '~shared/models/tome';
import { Vinyle } from '~shared/models/vinyle';

export abstract class MockCollection {
  static readonly itemAcquired: Item = { id: 'uid1', acquired: false };
  static readonly itemNotAcquired: Item = { id: 'uid2', acquired: true };
  static readonly items: Item[] = [MockCollection.itemNotAcquired, MockCollection.itemAcquired];

  static readonly newGame = { id: 'uuid', cover: null, acquired: false } as Item;
  static readonly newAmiibos = { id: 'uuid', image: null, acquired: false } as Item;
  static readonly newVinyle = { id: 'uuid', cover: null, acquired: false } as Item;
  static readonly newBook = {
    id: 'uuid',
    image: null,
    acquired: false,
    tomes: [],
    authors: [null],
  } as Item;

  static readonly amiibo1: Amiibo = {
    ...MockCollection.itemAcquired,
    character: 'Character 1',
    serie: 'Serie',
    image: 'image',
  };
  static readonly amiibo2: Amiibo = {
    ...MockCollection.itemNotAcquired,
    character: 'Character 2',
    serie: 'Serie',
    image: 'image',
  };
  static readonly amiibos: Amiibo[] = [MockCollection.amiibo2, MockCollection.amiibo1];

  static readonly gameBoys: Console = {
    id: 'game-boy',
    name: 'Console test',
    manufacturer: 'manufacturer',
    acquired: false,
    portable: true,
    generation: 1,
  };
  static readonly gameCube: Console = {
    id: 'game-cube',
    name: 'Console test 2',
    manufacturer: 'manufacturer',
    acquired: false,
    portable: false,
    generation: 1,
  };
  static readonly consoles: Console[] = [MockCollection.gameBoys, MockCollection.gameCube];

  static readonly game1: Game = {
    ...MockCollection.itemAcquired,
    title: 'Title1',
    maxPrice: 0,
    console: 'game-boy',
    cover: 'cover',
  };
  static readonly game2: Game = {
    ...MockCollection.itemNotAcquired,
    title: 'Title2',
    maxPrice: 10,
    console: 'game-boy',
    cover: 'cover',
  };
  static readonly games: Game[] = [MockCollection.game2, MockCollection.game1];

  static readonly vinyle1: Vinyle = {
    ...MockCollection.itemAcquired,
    title: 'Title 1',
    artist: 'Artist',
    cover: 'cover',
  };
  static readonly vinyle2: Vinyle = {
    ...MockCollection.itemNotAcquired,
    title: 'Title 2',
    artist: 'Artist',
    cover: 'cover',
  };
  static readonly vinyles: Vinyle[] = [MockCollection.vinyle2, MockCollection.vinyle1];

  static readonly tome1: Tome = {
    number: 2,
    acquired: false,
    image: 'image',
  };
  static readonly tome2: Tome = {
    number: 1,
    acquired: true,
    image: 'image',
  };
  static readonly tomes: Tome[] = [MockCollection.tome1, MockCollection.tome2];

  static readonly book1: Book = {
    ...MockCollection.itemAcquired,
    title: 'Title 1',
    type: BookType.Book,
    authors: ['Author'],
    publisher: 'Publisher',
    image: 'image',
    tomes: MockCollection.tomes,
  };
  static readonly book2: Book = {
    ...MockCollection.itemNotAcquired,
    title: 'Title 2',
    type: BookType.Book,
    authors: ['Author1', 'Author2'],
    publisher: 'Publisher',
    image: 'image',
    tomes: [],
  };
  static readonly books: Book[] = [MockCollection.book2, MockCollection.book1];
}
