function extractElementsWithKeys(root: HTMLElement): Record<string, HTMLElement> {
  const elements: Record<string, HTMLElement> = {};
  for (const element of root.querySelectorAll('[key]')) {
    elements[element.getAttribute('key') ?? '?'] = element as HTMLElement;
  }
  return elements;
}

class UIElement<TKey extends string = any> {
  public readonly element: HTMLDivElement;

  protected readonly elements: Record<TKey, HTMLElement>;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add(...this.getElementClasses());
    this.element.innerHTML = this.getTemplate();
    this.elements = extractElementsWithKeys(this.element);
    this.init();
  }

  getElementClass(): string {
    return 'ui-element';
  }

  getElementClasses(): string[] {
    return [this.getElementClass()];
  }

  getTemplate(): string {
    return '';
  }

  init(): void {}
}

export { UIElement };
