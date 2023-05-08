import File from 'fetch-blob/file.js';

export const validFile = new File(['abc'], 'hello-world.txt', {
  type: 'text/plain'
})

export function createFile () {
  const formData = new FormData();
  formData.append('file', validFile);
  formData.append('data', JSON.stringify({ relationships: { users: { data: [{ type: 'users', id: '12345678910abcdef' }] } } }))
  return formData;
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
  formData.append('data', JSON.stringify({ relationships: { [relationName]: [{ data: { type: resourceType, id: resourceId } }] } }));
  return formData;
}
