import { Home } from './home';
import { User } from './user';

export interface HomesDataResponse {
  homes: Home[];
  user: User;
}
