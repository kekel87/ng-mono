export interface RoomMeasureParams {
  home_id: string;
  room_id?: string;
  scale: string;
  type: string;
  date_begin?: number;
  date_end?: number;
  limit?: number;
  optimize?: boolean;
  realTime?: boolean;
}
