import { Inject, Injectable } from '@angular/core';
import { FileOptions } from '@supabase/storage-js';
import {
  createClient,
  PostgrestSingleResponse,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, first, from, map } from 'rxjs';

import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { RuntimeConfig } from '~shared/models/runtime-config';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public client: SupabaseClient;

  constructor(@Inject(RUNTIME_CONFIG) { supabase }: RuntimeConfig) {
    this.client = createClient(supabase.url, supabase.key);
  }

  count(collection: string): Observable<number> {
    return from(this.client.from(collection).select('*', { count: 'exact', head: true })).pipe(map(({ count }) => count || 0));
  }

  findById<T>(collection: string, id: string): Observable<T | undefined> {
    return from(this.client.from(collection).select().eq('id', id)).pipe(map((dataSource) => dataSource.data?.[0] || undefined));
  }

  findAll<T extends { id: string }>(collection: string): Observable<T[]> {
    return from(this.client.from(collection).select()).pipe(map((dataSource) => dataSource.data || []));
  }

  save<T extends { id: string }>(collection: string, data: Partial<T>): Observable<string> {
    return from(this.client.from(collection).upsert(data).select('id')).pipe(map((dataSource) => dataSource.data?.[0]?.id));
  }

  delete(collection: string, id: string): Observable<PostgrestSingleResponse<null>> {
    return from(this.client.from(collection).delete().eq('id', id));
  }

  onChange<T extends { id: string }>(collection: string): Observable<T[]> {
    const changes = new BehaviorSubject<T[]>([]);

    this.findAll<T>(collection)
      .pipe(first())
      .subscribe((items) => changes.next(items));

    this.client
      .channel('table-db-changes')
      .on<T>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: collection,
        },
        (payload) => this.handleChanges<T>(changes, payload)
      )
      .subscribe();

    return changes.asObservable();
  }

  upload(path: string, blob: Blob, fileOptions?: FileOptions): Observable<string> {
    return from(this.client.storage.from('collections').upload(path, blob, fileOptions)).pipe(map(({ data }) => data?.path || ''));
  }

  download(path: string): Observable<Blob | null> {
    return from(this.client.storage.from('collections').download(path)).pipe(map(({ data }) => data));
  }

  private handleChanges<T extends { id: string }>(changes: BehaviorSubject<T[]>, payload: RealtimePostgresChangesPayload<T>) {
    switch (payload.eventType) {
      case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT:
        changes.next([...changes.value, payload.new]);
        break;
      case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE:
        changes.next(
          changes.value.reduce((acc: T[], curr: T) => (curr.id === payload.new.id ? [...acc, payload.new] : [...acc, curr]), [])
        );
        break;
      case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE:
        changes.next(changes.value.filter((list: T) => list.id === payload.old.id));
        break;
    }
  }
}
