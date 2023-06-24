import { NavigationEnd } from '@angular/router';
import { ReplaySubject } from 'rxjs';

export class MockRouter {
  public events = new ReplaySubject<NavigationEnd>(0);
}
