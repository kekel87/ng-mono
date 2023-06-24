import { KeyValue } from '@angular/common';

export abstract class OrderUtils {
  static original<T>(_: KeyValue<string, T>, __: KeyValue<string, T>): number {
    return 0;
  }
}
