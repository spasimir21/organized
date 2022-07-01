enum ItemType {
  SectorLink,
  Listing,
  Photo
}

interface BaseItem {
  sector: string;
  id: string;
  type: ItemType;
  name: string;
  createdAt: Date;
}

interface SectorLink extends BaseItem {
  type: ItemType.SectorLink;
  location: string;
}

interface Listing extends BaseItem {
  type: ItemType.Listing;
  items: string[];
  sectorDepth: number;
}

interface Photo extends BaseItem {
  type: ItemType.Photo;
}

type Item = SectorLink | Listing | Photo;

type Items = Record<string, Item>;

type SerializedBaseItem<TItemType extends ItemType> = [TItemType, string, number];
type SerializedListing = [...SerializedBaseItem<ItemType.Listing>, string[], number];
type SerializedSectorLink = [...SerializedBaseItem<ItemType.SectorLink>, string];
type SerializedPhoto = SerializedBaseItem<ItemType.Photo>;

type SerializedItem = SerializedSectorLink | SerializedListing | SerializedPhoto;

type SerializedItems = Record<string, SerializedItem>;

export {
  ItemType,
  BaseItem,
  SectorLink,
  Listing,
  Photo,
  Item,
  Items,
  SerializedBaseItem,
  SerializedSectorLink,
  SerializedListing,
  SerializedPhoto,
  SerializedItem,
  SerializedItems
};
