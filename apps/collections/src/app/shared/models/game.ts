import { Item } from './item';

export interface Game extends Item {
  title: string;
  maxPrice: number;
  console: string;
  cover: string | null;
}
