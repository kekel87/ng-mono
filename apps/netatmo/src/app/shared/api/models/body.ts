import { ServerResponse } from './server-response';

export interface Body<T> extends ServerResponse {
  body: T;
}
