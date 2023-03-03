import { Module } from '../api/models/module';

export interface ModuleWithRoom extends Omit<Module, 'room_id'> {
  room_id: string;
}
