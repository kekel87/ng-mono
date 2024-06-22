import { Injectable } from '@angular/core';
import { SupabaseService } from '@ng-mono/shared/utils';
import { from, map, Observable } from 'rxjs';

import { Entry, EntrySave } from '../models/entry';
import { Log, LogSave } from '../models/log';

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private supabase: SupabaseService) {}

  saveLog(log: LogSave): Observable<Log> {
    return from(this.supabase.from('log').upsert(log).select()).pipe(map((dataSource) => dataSource.data?.[0]));
  }

  getLogs(): Observable<Log[]> {
    return from(this.supabase.from('log').select()).pipe(map((dataSource) => dataSource.data || []));
  }

  getEntries(logId: string): Observable<Entry[]> {
    return from(this.supabase.from('entry').select().eq('logId', logId)).pipe(map((dataSource) => dataSource.data || []));
  }

  getEntry(id: string): Observable<Entry> {
    return from(this.supabase.from('entry').select().eq('id', id)).pipe(map((dataSource) => dataSource.data?.[0] || undefined));
  }

  saveEntry(log: EntrySave): Observable<Entry> {
    return from(this.supabase.from('entry').upsert(log).select()).pipe(map((dataSource) => dataSource.data?.[0]));
  }
}
