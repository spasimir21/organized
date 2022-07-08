import { Signal } from '../utils/signal';
import { UIElement } from './element';

class HeaderUI extends UIElement<'title' | 'addButton'> {
  public readonly onAddButtonClicked = new Signal();

  getElementClass(): string {
    return 'header';
  }

  getTemplate(): string {
    return `
      <p key="title">Organized</p>
      <div key="addButton" class="header-add-button"></div>
    `;
  }

  init(): void {
    this.elements.addButton.addEventListener('click', () => this.onAddButtonClicked.send());
  }

  setTitle(title: string): void {
    this.elements.title.textContent = title;
  }

  setAddButtonVisible(visible: boolean): void {
    this.elements.addButton.style.display = visible ? null : 'none';
  }
}

export { HeaderUI };
