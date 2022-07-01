import { UIElement } from './element';

class PageUI<TKey extends string = any> extends UIElement<TKey> {
  getElementClass(): string {
    return 'page';
  }
}

export { PageUI };
