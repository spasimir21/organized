import {
  Item,
  Items,
  ItemType,
  Listing,
  SectorLink,
  SerializedItem,
  SerializedItems,
  SerializedListing,
  SerializedSectorLink
} from './interfaces';

function serializeListing(item: Listing): SerializedListing {
  return [item.type, item.name, item.createdAt.getTime(), item.items, item.sectorDepth];
}

function serializeSectorLink(item: SectorLink): SerializedSectorLink {
  return [item.type, item.name, item.createdAt.getTime(), item.location];
}

function serializeItem(item: Item): SerializedItem {
  // prettier-ignore
  return item.type == ItemType.Listing ? serializeListing(item)
       : item.type == ItemType.SectorLink ? serializeSectorLink(item)
       : [item.type, item.name, item.createdAt.getTime()];
}

function serializeItems(items: Items): SerializedItems {
  const serializedItems: SerializedItems = {};
  for (const id in items) serializedItems[id] = serializeItem(items[id]);
  return serializedItems;
}

function deserializeListing(id: string, sector: string, serializedItem: SerializedListing): Listing {
  return {
    sector,
    id,
    type: serializedItem[0],
    name: serializedItem[1],
    createdAt: new Date(serializedItem[2]),
    items: serializedItem[3],
    sectorDepth: serializedItem[4]
  };
}

function deserializeSectorLink(id: string, sector: string, serializedItem: SerializedSectorLink): SectorLink {
  return {
    sector,
    id,
    type: serializedItem[0],
    name: serializedItem[1],
    createdAt: new Date(serializedItem[2]),
    location: serializedItem[3]
  };
}

function deserializeItem(id: string, sector: string, serializedItem: SerializedItem): Item {
  if (serializedItem[0] == ItemType.Listing) return deserializeListing(id, sector, serializedItem as any);
  if (serializedItem[0] == ItemType.SectorLink) return deserializeSectorLink(id, sector, serializedItem as any);
  return {
    sector,
    id,
    type: serializedItem[0],
    name: serializedItem[1],
    createdAt: new Date(serializedItem[2])
  } as any;
}

function deserializeItems(sector: string, serializedItems: SerializedItems): Items {
  const items: Items = {};
  for (const id in serializedItems) items[id] = deserializeItem(id, sector, serializedItems[id]);
  return items;
}

export { serializeItems, deserializeItems };
