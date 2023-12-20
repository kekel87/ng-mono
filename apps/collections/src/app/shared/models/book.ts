import { BookType } from '~shared/enums/book-type';

import { Item } from './item';
import { Tome } from './tome';

export interface Book extends Item {
  title: string;
  type: BookType;
  authors: string[];
  publisher: string;
  image: string | null;
  tomes: Tome[];
}
