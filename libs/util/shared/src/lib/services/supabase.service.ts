import { Inject, Injectable, InjectionToken } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  key: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SupabaseConfig');

@Injectable({ providedIn: 'root' })
export class SupabaseService extends SupabaseClient {
  constructor(@Inject(SUPABASE_CONFIG) { url, key }: SupabaseConfig) {
    super(url, key);
  }
}
