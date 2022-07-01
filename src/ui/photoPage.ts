import { PageUI } from './page';

class PhotoPageUI extends PageUI<'image'> {
  getElementClasses(): string[] {
    return ['page', 'photo-page'];
  }

  getTemplate(): string {
    return `
      <img key="image" />
    `;
  }

  setImageSource(source: string): void {
    (this.elements.image as HTMLImageElement).src = source;
  }
}

export { PhotoPageUI };
