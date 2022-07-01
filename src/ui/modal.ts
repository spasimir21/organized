import { Signal } from '../utils/signal';
import { UIElement } from './element';

class ModalContentUI<TKey extends string = any> extends UIElement<TKey> {
  public readonly onDone = new Signal<[...any[]]>();
}

class ModalUI<TResult> extends UIElement<'modalContainer'> {
  public readonly onDone = new Signal<[result: TResult]>();
  public readonly onClose = new Signal();

  private content: ModalContentUI;

  constructor() {
    super();
    this.done = this.done.bind(this);
  }

  getElementClass(): string {
    return 'modal';
  }

  getTemplate(): string {
    return `
      <div key="modalContainer" class="modal-container"></div>
    `;
  }

  init() {
    this.element.addEventListener('click', event => (event.target == this.element ? this.close() : null));
  }

  setModalContent(content: ModalContentUI) {
    if (this.content) this.content.onDone.remove(this.done);

    this.elements.modalContainer.innerHTML = '';
    this.elements.modalContainer.appendChild(content.element);

    this.content = content;
    this.content.onDone.listen(this.done);
  }

  done(result: TResult) {
    this.close();
    this.onDone.send(result);
  }

  close() {
    this.element.remove();
    this.onClose.send();
  }
}

export { ModalUI, ModalContentUI };
