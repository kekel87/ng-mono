import { Dictionary } from '@ngrx/entity';

import { Collection } from '~shared/enums/collection';
import { Console } from '~shared/models/console';
import { Game } from '~shared/models/game';
import { Item } from '~shared/models/item';
import { ItemToDisplay } from '~shared/models/item-to-display';
import { toPredicate } from '~shared/utils/string';

import { MetaUtils } from './meta';

export abstract class GameMetaUtils extends MetaUtils {
  static override readonly title = 'Jeux vidéo';
  static override readonly icon = 'videogame_asset';
  static override readonly titleKey = 'title';
  static override readonly relations = [Collection.Consoles];

  static override newItem(id: string): Item {
    return { id, cover: 'assets/400x200.png', acquired: false } as Item;
  }

  static override toItemsDisplay(data: Item[] | (Item[] | Dictionary<Item>)[]): ItemToDisplay[] {
    const [games, consoleEntities] = data as [Game[], Dictionary<Console>];
    return games.map((game) => {
      const console = consoleEntities[game.console];
      const consoleName = console ? console.name : game.console;

      return {
        id: game.id,
        title: game.title,
        subTitle: consoleName,
        acquired: game.acquired,
        image: game.cover,
        predicate: GameMetaUtils.predicate(game, consoleName),
      };
    });
  }

  private static predicate(item: Game, other?: string): string {
    const s = item.acquired ? 'acquis' : 'recherche-voulu';
    return toPredicate(`${item.title}-${other}-${item.comment}-${s}`);
  }
}
