import { Item, ItemType, Listing, Photo, SectorLink } from './interfaces';
import { createSector, getSectorIds } from './filesystem';
import { loadSector, Sector } from './sector';
import { uuid } from '../utils/uuid';

class Persistence {
  private sectors: Record<string, Sector> = {};

  async init() {
    const justCreated = await this.ensureRootSector();
    if (!justCreated) await this.loadSector('$root');
  }

  async ensureRootSector(): Promise<boolean> {
    const sectorIds = await getSectorIds();
    if (sectorIds.includes('$root')) return false;
    await this.createSector('$root');
    await this.createListing('Root', '$root', 0, '$root');
    return true;
  }

  async loadSector(id: string) {
    const sector = await loadSector(id);
    this.sectors[id] = sector;
    return sector;
  }

  async createSector(id: string) {
    await createSector(id);
    return this.loadSector(id);
  }

  getItem(id: string, sectorId: string): Item | null {
    return this.sectors[sectorId].getItem(id);
  }

  async createSectorLink(name: string, location: string, sectorId: string): Promise<SectorLink> {
    const sectorLink: SectorLink = {
      sector: sectorId,
      id: uuid(),
      type: ItemType.SectorLink,
      name,
      createdAt: new Date(),
      location
    };

    this.sectors[sectorId].addItem(sectorLink);
    this.sectors[sectorId].save();

    return sectorLink;
  }

  async createListing(name: string, sectorId: string, sectorDepth: number, listingId?: string): Promise<Listing> {
    const id = listingId ?? uuid();

    if (Object.keys(this.sectors[sectorId]).length >= 100 || sectorDepth >= 3) {
      await this.createSector(id);
      const listing = await this.createListing(name, id, 0, id);
      await this.createSectorLink(name, id, sectorId);
      return listing;
    }

    const listing: Listing = {
      sector: sectorId,
      id,
      type: ItemType.Listing,
      name,
      createdAt: new Date(),
      items: [],
      sectorDepth
    };

    this.sectors[sectorId].addItem(listing);
    this.sectors[sectorId].save();

    return listing;
  }

  async createPhoto(name: string, sectorId: string): Promise<Photo> {
    const photo: Photo = {
      sector: sectorId,
      id: uuid(),
      type: ItemType.Photo,
      name,
      createdAt: new Date()
    };

    this.sectors[sectorId].addItem(photo);
    this.sectors[sectorId].save();

    return photo;
  }
}

export { Persistence };
