import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Persistence } from './persistence/persistence';
import { ItemType } from './persistence/interfaces';
import { AddItemModalUI } from './ui/addItemModal';
import { ListingPageUI } from './ui/listingPage';
import { PhotoPageUI } from './ui/photoPage';
import { Router } from './utils/router';
import { HeaderUI } from './ui/header';
import { ModalUI } from './ui/modal';
import { PageUI } from './ui/page';
import { AppUI } from './ui/app';

interface Route {
  itemType: ItemType;
  sectorDepth: number;
  sectorId: string;
  itemName: string;
  itemId: string;
}

class App {
  public readonly persistence: Persistence;

  public readonly ui = new AppUI();
  public readonly header = new HeaderUI();

  public readonly router = new Router<Route>();
  private _page: PageUI;

  get page(): PageUI {
    return this._page;
  }

  constructor() {
    this.persistence = new Persistence();

    this.ui.setHeader(this.header);
    this.header.onAddButtonClicked.listen(() => this.openAddItemModal());

    this.router.onRouteChanged.listen(route => this.changePage(route));
  }

  async init() {
    await this.persistence.init();
    this.navigateTo({ itemType: ItemType.Listing, itemName: 'Organized', sectorDepth: 0, sectorId: '$root', itemId: '$root' });
  }

  openAddItemModal(): void {
    const modal = new ModalUI<{ type: ItemType; name: string }>();
    modal.setModalContent(new AddItemModalUI());

    modal.onDone.listen(async result => {
      if (result.type == ItemType.Listing) {
        await this.persistence.createListing(
          this.router.currentRoute.itemId,
          result.name,
          this.router.currentRoute.sectorId,
          this.router.currentRoute.sectorDepth + 1
        );
      } else {
        const photo = await Camera.getPhoto({ source: CameraSource.Camera, resultType: CameraResultType.Base64 });
        if (!photo.base64String) return;

        const photoItem = await this.persistence.createPhoto(
          this.router.currentRoute.itemId,
          result.name,
          this.router.currentRoute.sectorId
        );

        this.persistence.savePhotoData(photoItem.id, photoItem.sector, photo.base64String);
      }

      this.router.refreshRoute();
    });

    document.body.appendChild(modal.element);
  }

  navigateTo(route: Route) {
    this.router.pushRoute(route);
  }

  goBack(): boolean {
    if (!this.router.canGoBack) return false;
    this.router.popRoute();
    return true;
  }

  changePage(route: Route | null) {
    if (route == null) return;

    const page = route.itemType == ItemType.Listing ? new ListingPageUI(this) : new PhotoPageUI(this);
    this._page = page;

    this.ui.setPage(page);

    page.onNavigatedTo(route);
  }
}

export { App, Route };
