import { HeatingZone } from './heating-zone';
import { Timetable } from './timetable';

export interface HomeHeatingSchedule {
  timetable: Timetable[];
  zones: HeatingZone[];
  name: string;
  default: boolean;
  away_temp: number;
  hg_temp: number;
  type: string;
}
