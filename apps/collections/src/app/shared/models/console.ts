import { Item } from './item';

export interface Console extends Item {
  id: string;
  name: string;
  manufacturer: string;
  acquired: boolean;
  portable: boolean;
  generation: number;
}
