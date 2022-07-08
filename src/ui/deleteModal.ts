import { ItemType } from '../persistence/interfaces';
import { ModalContentUI } from './modal';

class DeleteModalUI extends ModalContentUI<'text' | 'deleteButton'> {
  private readonly itemType: ItemType;
  private readonly itemName: string;

  constructor(itemType: ItemType, itemName: string) {
    super(false);
    this.itemType = itemType;
    this.itemName = itemName;
    this.init();
  }

  getElementClass(): string {
    return 'delete-modal';
  }

  getTemplate(): string {
    return `
      <p key="text"></p>
      <p key="deleteButton" class="delete-button">Delete</p>
    `;
  }

  init() {
    const itemTypeString = this.itemType == ItemType.Listing || this.itemType == ItemType.SectorLink ? 'listing' : 'photo';

    this.elements.text.textContent = `Are you sure you want to delete ${itemTypeString} '${this.itemName}'?`;

    this.elements.deleteButton.addEventListener('click', () => this.onDone.send());
  }
}

export { DeleteModalUI };
