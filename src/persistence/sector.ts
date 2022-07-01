import { readSectorItems, updateSectorItems } from './filesystem';
import { Item, Items, SerializedItems } from './interfaces';
import { deserializeItems, serializeItems } from './items';

class Sector {
  public readonly id: string;

  private readonly items: Items;

  constructor(id: string, serializedItems: SerializedItems) {
    this.id = id;
    this.items = deserializeItems(id, serializedItems);
  }

  addItem(item: Item) {
    this.items[item.id] = item;
  }

  getItem(id: string): Item | null {
    return this.items[id] ?? null;
  }

  save() {
    return updateSectorItems(this.id, serializeItems(this.items));
  }
}

async function loadSector(id: string) {
  const nodes = await readSectorItems(id);
  return new Sector(id, nodes);
}

export { Sector, loadSector };
