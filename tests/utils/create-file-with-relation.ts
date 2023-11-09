import { File } from 'fetch-blob/file.js';
import { FormData } from 'formdata-polyfill/esm.min.js';

export const validFile = new File(['abc'], 'hello-world.txt', {
  type: 'text/plain'
});

export function createFile () {
  const formData = new FormData();
  formData.append('file', validFile);
  return formData;
}

export function createFileWithManyRelationship ({
  relationName,
  resourceType,
  resourceId,
}: {
    resourceType: string,
    relationName: string,
    resourceId: string,
}) {
  const formData = createFile();
  formData.append('data', JSON.stringify({ relationships: { [relationName]: { data: [{ type: resourceType, id: resourceId }, { type: resourceType, id: resourceId }] } } }));
  return formData;
}
