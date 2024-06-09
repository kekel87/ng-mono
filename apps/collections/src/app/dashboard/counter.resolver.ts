import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Collection } from '~shared/enums/collection';
import { SupabaseHelperService } from '~shared/services/supabase-helper.service';

export const counterResolver: ResolveFn<Partial<Record<Collection, number>>> = () => {
  const supabaseService = inject(SupabaseHelperService);

  return forkJoin([
    supabaseService.count(Collection.Amiibos),
    supabaseService.count(Collection.Books),
    supabaseService.count(Collection.Games),
    supabaseService.count(Collection.Vinyles),
  ]).pipe(
    map(([amiibos, books, games, vinyle]) => ({
      [Collection.Amiibos]: amiibos,
      [Collection.Books]: books,
      [Collection.Games]: games,
      [Collection.Vinyles]: vinyle,
    }))
  );
};
