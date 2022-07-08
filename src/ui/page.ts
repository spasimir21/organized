import { UIElement } from './element';
import { App, Route } from '../app';

class PageUI<TKey extends string = any> extends UIElement<TKey> {
  protected readonly app: App;

  constructor(app: App) {
    super(false);
    this.app = app;
    this.init();
  }

  getElementClass(): string {
    return 'page';
  }

  onNavigatedTo(route: Route): void {
    this.app.header.setTitle(route.itemName);
  }
}

export { PageUI };
