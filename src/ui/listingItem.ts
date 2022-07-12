import { Item, ItemType } from '../persistence/interfaces';
import { addLongtapListener } from '../utils/longtap';
import { DeleteModalUI } from './deleteModal';
import { UIElement } from './element';
import { App, Route } from '../app';
import { ModalUI } from './modal';

class ListingItemUI extends UIElement<'image' | 'name'> {
  public readonly item: Item;

  private readonly sectorId: string;
  private readonly itemId: string;
  private readonly app: App;

  constructor(app: App, itemId: string, sectorId: string) {
    super(false);
    this.app = app;
    this.itemId = itemId;
    this.sectorId = sectorId;

    this.item = this.app.persistence.getItem(this.itemId, this.sectorId) as Item;
    this.init();
  }

  getElementClass(): string {
    return 'listing-item';
  }

  getTemplate(): string {
    return `
      <img key="image" />
      <p key="name"></p>
    `;
  }

  init() {
    this.elements.name.textContent = this.item.name;

    this.element.addEventListener('click', () => {
      const newRoute: Route = {
        itemType: this.item.type,
        itemName: this.item.name,
        sectorDepth: this.item.type == ItemType.Listing ? this.item.sectorDepth : 0,
        sectorId: this.item.sector,
        itemId: this.item.id
      };

      if (this.item.type == ItemType.SectorLink) {
        newRoute.itemType = ItemType.Listing;
        newRoute.sectorId = this.item.location;
        newRoute.itemId = this.item.location;
      }

      this.app.navigateTo(newRoute);
    });

    addLongtapListener(
      this.element,
      () => {
        const modal = new ModalUI<void>();
        modal.setModalContent(new DeleteModalUI(this.item.type, this.item.name));

        modal.onDone.listen(async () => {
          await this.app.persistence.deleteItem(this.app.router.currentRoute.itemId, this.item.id, this.item.sector);
          this.app.router.refreshRoute();
        });

        document.body.appendChild(modal.element);
      },
      () => (this.element.style.backgroundColor = 'var(--medium-color)'),
      () => (this.element.style.backgroundColor = 'none')
    );
  }
}

export { ListingItemUI };
