import { Item } from './item';
import { Tome } from './tome';

export interface Book extends Item {
  title: string;
  authors: string[];
  publisher: string;
  image: string;
  tomes: Tome[];
}
