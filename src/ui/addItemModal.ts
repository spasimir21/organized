import { ItemType } from '../persistence/interfaces';
import { ModalContentUI } from './modal';

class AddItemModalUI extends ModalContentUI<'itemNameInput' | 'addButton' | 'photoTypeButton' | 'listingTypeButton'> {
  getElementClass(): string {
    return 'add-item-modal';
  }

  getTemplate(): string {
    return `
      <p>Add an Item:</p>
      <input key="itemNameInput" type="text" placeholder="Item Name"></input>
      <div class="add-item-modal-bottom">
        <div class="add-item-modal-item-types">
          <div key="photoTypeButton" class="item-type-icon item-type-icon-selected"></div>
          <div key="listingTypeButton" class="item-type-icon"></div>
        </div>
        <p key="addButton" class="add-button">Add</p>
      </div>
    `;
  }

  init(): void {
    const itemInfo = { type: ItemType.Photo, name: '' };

    const onItemTypeSelected = (itemType: ItemType) => {
      itemInfo.type = itemType;

      if (itemType == ItemType.Photo) {
        this.elements.listingTypeButton.classList.remove('item-type-icon-selected');
        this.elements.photoTypeButton.classList.add('item-type-icon-selected');
      } else {
        this.elements.photoTypeButton.classList.remove('item-type-icon-selected');
        this.elements.listingTypeButton.classList.add('item-type-icon-selected');
      }
    };

    this.elements.photoTypeButton.addEventListener('click', () => onItemTypeSelected(ItemType.Photo));
    this.elements.listingTypeButton.addEventListener('click', () => onItemTypeSelected(ItemType.Listing));

    this.elements.itemNameInput.addEventListener(
      'input',
      () => (itemInfo.name = (this.elements.itemNameInput as HTMLInputElement).value)
    );

    this.elements.addButton.addEventListener('click', () => {
      if (itemInfo.name.trim().length == 0) return;

      this.onDone.send(itemInfo);
    });
  }
}

export { AddItemModalUI };
