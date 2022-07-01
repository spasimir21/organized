import { UIElement } from './element';
import { HeaderUI } from './header';
import { PageUI } from './page';

class AppUI extends UIElement<'headerContainer' | 'pageContainer'> {
  getElementClass(): string {
    return 'app-container';
  }

  getTemplate(): string {
    return `
      <div key="headerContainer" class="header-container"></div>
      <div key="pageContainer" class="page-container"></div>
    `;
  }

  setHeader(header: HeaderUI): void {
    this.elements.headerContainer.innerHTML = '';
    this.elements.headerContainer.appendChild(header.element);
  }

  setPage(page: PageUI): void {
    this.elements.pageContainer.innerHTML = '';
    this.elements.pageContainer.appendChild(page.element);
  }
}

export { AppUI };
