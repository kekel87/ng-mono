export interface MeasureParams {
  device_id: string;
  module_id?: string;
  scale: string;
  type: string;
  date_begin?: number;
  date_end?: number;
  limit?: number;
  optimize?: boolean;
  realTime?: boolean;
}
