import File from 'fetch-blob/file.js';

export const validFile = new File(['abc'], 'hello-world.txt', {
  type: 'text/plain'
})

export function createFile () {
  return validFile;
}

export function createFileWithRelationship ({
  relationName,
  resourceType,
  resourceId,
}: {
    resourceType: string,
    relationName: string,
    resourceId: string,
}) {
  const formData = createFile();
  formData.append('data', JSON.stringify({ relationships: { [relationName]: { data: { type: resourceType, id: resourceId } } } }));
  return formData;
}
