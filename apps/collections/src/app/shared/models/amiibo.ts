import { Item } from './item';

export interface Amiibo extends Item {
  character: string;
  serie: string;
  image: string | null;
}
