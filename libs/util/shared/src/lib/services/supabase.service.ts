import { Inject, Injectable, InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  key: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SupabaseConfig');

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public client: SupabaseClient;

  constructor(@Inject(SUPABASE_CONFIG) { url, key }: SupabaseConfig) {
    this.client = createClient(url, key);
  }
}
