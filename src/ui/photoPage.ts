import { PageUI } from './page';
import { Route } from '../app';

class PhotoPageUI extends PageUI<'image' | 'loadingText'> {
  getElementClasses(): string[] {
    return ['page', 'photo-page'];
  }

  getTemplate(): string {
    return `
      <div key="image" class="photo">
        <p key="loadingText" class="photo-loading-text">Loading...</p>
      </div>
    `;
  }

  async onNavigatedTo(route: Route) {
    super.onNavigatedTo(route);
    this.app.header.setAddButtonVisible(false);

    const base64Photo = await this.app.persistence.loadPhotoData(route.itemId, route.sectorId);
    this.elements.image.style.backgroundImage = `url("data:image/jpg;base64,${base64Photo}")`;

    this.elements.loadingText.remove();
  }
}

export { PhotoPageUI };
