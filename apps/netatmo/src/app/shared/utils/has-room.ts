import { Module } from '../api/models/module';
import { ModuleWithRoom } from '../models/module-with-room';

export function hasRoom(module: Module): module is ModuleWithRoom {
  return module.room_id !== undefined;
}
