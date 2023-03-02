import { HomeHeatingSchedule } from './home-heating-schedule';
import { Module } from './module';
import { Room } from './room';
import { ThermMode } from '../enums/therm_mod';

export interface Home {
  id: string;
  name: string;
  altitude: number;
  coordinates: Array<string>;
  country: string;
  timezone: string;
  rooms: Room[];
  modules: Module[];
  therm_setpoint_default_duration?: number;
  therm_boost_default_duration?: number;
  schedules?: Array<HomeHeatingSchedule>;
  therm_mode?: ThermMode;
  temperature_control_mode?: string;
}
