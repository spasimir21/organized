import { ItemType, Listing } from '../persistence/interfaces';
import { ListingItemUI } from './listingItem';
import { PageUI } from './page';
import { Route } from '../app';

class ListingPageUI extends PageUI<'text' | 'items'> {
  getElementClasses(): string[] {
    return ['page', 'listing-page'];
  }

  getTemplate(): string {
    return `
      <p key="text" class="listing-page-text">Loading...</p>
      <div key="items" class="listing-items"></div>
    `;
  }

  async onNavigatedTo(route: Route) {
    super.onNavigatedTo(route);
    this.app.header.setAddButtonVisible(true);

    if (!this.app.persistence.isSectorLoaded(route.sectorId)) await this.app.persistence.loadSector(route.sectorId);

    const listing = this.app.persistence.getItem(route.itemId, route.sectorId) as Listing;

    if (listing.items.length == 0) {
      this.elements.text.textContent = 'There are no items in this listing!';
    } else {
      this.elements.text.remove();
    }

    const items = listing.items
      .map(itemId => new ListingItemUI(this.app, itemId, route.sectorId))
      .sort(item => (item.item.type == ItemType.Listing ? -1 : 0));

    for (const item of items) this.elements.items.appendChild(item.element);
  }
}

export { ListingPageUI };
