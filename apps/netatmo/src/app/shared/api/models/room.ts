import { RoomType } from '../enums/room-type';

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  module_ids: string[];
}
