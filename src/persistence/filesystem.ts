import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { SerializedItems } from './interfaces';

async function getSectorIds() {
  const directory = await Filesystem.readdir({ path: '.', directory: Directory.Data });
  return directory.files;
}

async function createSector(id: string) {
  await Filesystem.mkdir({ path: `./${id}`, directory: Directory.Data });
  await Filesystem.mkdir({ path: `./${id}/photos`, directory: Directory.Data });
  await Filesystem.writeFile({
    data: '{}',
    path: `./${id}/_items.json`,
    directory: Directory.Data,
    encoding: Encoding.UTF8
  });
}

async function readSectorItems(id: string): Promise<SerializedItems> {
  const file = await Filesystem.readFile({
    path: `./${id}/_items.json`,
    directory: Directory.Data,
    encoding: Encoding.UTF8
  });

  return JSON.parse(file.data);
}

async function updateSectorItems(id: string, items: SerializedItems) {
  await Filesystem.writeFile({
    data: JSON.stringify(items),
    path: `./${id}/_items.json`,
    directory: Directory.Data,
    encoding: Encoding.UTF8
  });
}

export { getSectorIds, createSector, readSectorItems, updateSectorItems };
