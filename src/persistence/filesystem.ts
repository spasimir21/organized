import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { SerializedItems } from './interfaces';

async function getSectorIds() {
  const directory = await Filesystem.readdir({ path: '.', directory: Directory.External });
  return directory.files;
}

async function createSector(id: string) {
  await Filesystem.mkdir({ path: `./${id}`, directory: Directory.External });
  await Filesystem.mkdir({ path: `./${id}/photos`, directory: Directory.External });
  await Filesystem.writeFile({
    data: '{}',
    path: `./${id}/_items.json`,
    directory: Directory.External,
    encoding: Encoding.UTF8
  });
}

async function deleteSector(id: string) {
  await Filesystem.rmdir({
    path: id,
    recursive: true,
    directory: Directory.External
  });
}

async function readSectorItems(id: string): Promise<SerializedItems> {
  const file = await Filesystem.readFile({
    path: `./${id}/_items.json`,
    directory: Directory.External,
    encoding: Encoding.UTF8
  });

  return JSON.parse(file.data);
}

async function updateSectorItems(id: string, items: SerializedItems) {
  await Filesystem.writeFile({
    data: JSON.stringify(items),
    path: `./${id}/_items.json`,
    directory: Directory.External,
    encoding: Encoding.UTF8
  });
}

async function savePhotoData(photoId: string, sectorId: string, photoData: string) {
  await Filesystem.writeFile({
    data: photoData,
    path: `./${sectorId}/photos/${photoId}.jpg`,
    directory: Directory.External
  });
}

async function loadPhotoData(photoId: string, sectorId: string): Promise<string> {
  const result = await Filesystem.readFile({
    path: `./${sectorId}/photos/${photoId}.jpg`,
    directory: Directory.External
  });

  return result.data;
}

async function deletePhotoData(photoId: string, sectorId: string) {
  await Filesystem.deleteFile({
    path: `./${sectorId}/photos/${photoId}.jpg`,
    directory: Directory.External
  });
}

export {
  getSectorIds,
  createSector,
  deleteSector,
  readSectorItems,
  updateSectorItems,
  savePhotoData,
  loadPhotoData,
  deletePhotoData
};
