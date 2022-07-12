import { createSector, deletePhotoData, deleteSector, getSectorIds, loadPhotoData, savePhotoData } from './filesystem';
import { Item, ItemType, Listing, Photo, SectorLink } from './interfaces';
import { loadSector, Sector } from './sector';
import { uuid } from '../utils/uuid';

class Persistence {
  public sectors: Record<string, Sector> = {};

  async init() {
    const justCreated = await this.ensureRootSector();
    if (!justCreated) await this.loadSector('$root');
  }

  async ensureRootSector(): Promise<boolean> {
    const sectorIds = await getSectorIds();
    if (sectorIds.includes('$root')) return false;
    await this.createSector('$root');
    await this.createListing(null, 'Organized', '$root', 0, '$root');
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

  async deleteSector(id: string) {
    await deleteSector(id);
    delete this.sectors[id];
  }

  isSectorLoaded(id: string): boolean {
    return id in this.sectors;
  }

  getItem(id: string, sectorId: string): Item | null {
    if (!(sectorId in this.sectors)) return null;
    return this.sectors[sectorId].getItem(id);
  }

  async createSectorLink(parentId: string, name: string, location: string, sectorId: string): Promise<SectorLink> {
    const sectorLink: SectorLink = {
      sector: sectorId,
      id: uuid(),
      type: ItemType.SectorLink,
      name,
      createdAt: new Date(),
      location
    };

    const parentListing = this.sectors[sectorId].getItem(parentId) as Listing;
    parentListing.items.push(sectorLink.id);

    this.sectors[sectorId].addItem(sectorLink);
    this.sectors[sectorId].save();

    return sectorLink;
  }

  async deleteSectorLink(parentId: string, linkId: string, location: string, sectorId: string) {
    const parentListing = this.sectors[sectorId].getItem(parentId) as Listing;
    parentListing.items.splice(parentListing.items.indexOf(linkId), 1);

    this.sectors[sectorId].deleteItem(linkId);
    this.sectors[sectorId].save();

    await this.deleteListing(null, location, location);
  }

  async createListing(
    parentId: string | null,
    name: string,
    sectorId: string,
    sectorDepth: number,
    listingId?: string
  ): Promise<Listing> {
    const id = listingId ?? uuid();

    if (Object.keys(this.sectors[sectorId]).length >= 100 || sectorDepth >= 3) {
      await this.createSector(id);
      const listing = await this.createListing(null, name, id, 0, id);
      await this.createSectorLink(parentId ?? '', name, id, sectorId);
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

    if (parentId != null) {
      const parentListing = this.sectors[sectorId].getItem(parentId) as Listing;
      parentListing.items.push(listing.id);
    }

    this.sectors[sectorId].addItem(listing);
    this.sectors[sectorId].save();

    return listing;
  }

  async deleteItem(parentId: string, itemId: string, sectorId: string) {
    const item = this.sectors[sectorId].getItem(itemId);
    if (item == null) return;

    if (item.type == ItemType.Listing) await this.deleteListing(parentId, itemId, sectorId);
    else if (item.type == ItemType.SectorLink) await this.deleteSectorLink(parentId, itemId, item.location, sectorId);
    else await this.deletePhoto(parentId, itemId, sectorId);
  }

  async deleteListing(parentId: string | null, listingId: string, sectorId: string) {
    if (parentId != null) {
      const parentListing = this.sectors[sectorId].getItem(parentId) as Listing;
      parentListing.items.splice(parentListing.items.indexOf(listingId), 1);
    }

    const listing = this.sectors[sectorId].getItem(listingId) as Listing;
    for (const itemId of listing.items) await this.deleteItem(listingId, itemId, sectorId);

    this.sectors[sectorId].deleteItem(listingId);
    this.sectors[sectorId].save();

    if (listingId == sectorId) await this.deleteSector(sectorId);
  }

  async createPhoto(parentId: string, name: string, sectorId: string): Promise<Photo> {
    const photo: Photo = {
      sector: sectorId,
      id: uuid(),
      type: ItemType.Photo,
      name,
      createdAt: new Date()
    };

    const parentListing = this.sectors[sectorId].getItem(parentId) as Listing;
    parentListing.items.push(photo.id);

    this.sectors[sectorId].addItem(photo);
    this.sectors[sectorId].save();

    return photo;
  }

  async deletePhoto(parentId: string, photoId: string, sectorId: string) {
    const parentListing = this.sectors[sectorId].getItem(parentId) as Listing;
    parentListing.items.splice(parentListing.items.indexOf(photoId), 1);

    this.sectors[sectorId].deleteItem(photoId);
    this.sectors[sectorId].save();

    await this.deletePhotoData(photoId, sectorId);
  }

  savePhotoData(photoId: string, sectorId: string, photoData: string) {
    return savePhotoData(photoId, sectorId, photoData);
  }

  loadPhotoData(photoId: string, sectorId: string) {
    return loadPhotoData(photoId, sectorId);
  }

  deletePhotoData(photoId: string, sectorId: string) {
    return deletePhotoData(photoId, sectorId);
  }
}

export { Persistence };
