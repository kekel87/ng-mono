import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Log } from '../models/log';
import { LogEntry } from '../models/log-entry';

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private httpClient: HttpClient) {}

  getLogs(): Observable<Log[]> {
    return of([]);
  }

  getLogEntry(_id: string): Observable<LogEntry> {
    return of({} as unknown as LogEntry);
  }
}
