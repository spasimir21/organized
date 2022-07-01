import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Persistence } from './persistence/persistence';
import { StatusBar } from '@capacitor/status-bar';
import { Dialog } from '@capacitor/dialog';
import { HeaderUI } from './ui/header';
import { ModalUI } from './ui/modal';
import { PageUI } from './ui/page';
import { AppUI } from './ui/app';
import { AddItemModalUI } from './ui/addItemModal';
import { ItemType } from './persistence/interfaces';
import { App as CapacitorApp } from '@capacitor/app';
import { PhotoPageUI } from './ui/photoPage';

function fixStatusBar() {
  StatusBar.setBackgroundColor({ color: '#4f3824' }).catch(console.log);
}

async function main() {
  fixStatusBar();

  // const persistence = new Persistence();
  // await persistence.init();

  const app = new AppUI();
  const header = new HeaderUI();
  // const page = new PhotoPageUI();

  app.setHeader(header);
  // app.setPage(page);

  header.setTitle('Harmonic Series');

  header.onAddButtonClicked.listen(async () => {
    const modal = new ModalUI<{ type: ItemType; name: string }>();

    modal.setModalContent(new AddItemModalUI());
    modal.onDone.listen(console.log);

    document.body.appendChild(modal.element);
    // const photo = await Camera.getPhoto({ source: CameraSource.Camera, resultType: CameraResultType.DataUrl });
    // page.setImageSource(photo.dataUrl ?? '');
  });

  document.body.appendChild(app.element);

  CapacitorApp.addListener('backButton', () => {});
}

window.addEventListener('DOMContentLoaded', main);
