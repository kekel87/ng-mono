import { HeatingRoom } from './heating-room';
import { HeatingZoneType } from '../enums/heating-zone-type';

export interface HeatingZone {
  name: string;
  id: number;
  type: HeatingZoneType;
  rooms: HeatingRoom[];
}
