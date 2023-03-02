import { ModuleType } from '../enums/module-type';

export interface Module {
  id: string;
  type: ModuleType;
  name: string;
  setup_date: number;

  room_id?: string;
  bridge?: string;
  module_bridged?: string[];
}
