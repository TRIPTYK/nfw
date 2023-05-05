import type { DocumentResource } from '../../src/api/resources/documents/schema';
import fs from 'fs/promises';

export async function generateFile (file: DocumentResource) {
  return fs.writeFile(file.path, 'sample')
}
