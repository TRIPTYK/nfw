import { FormData } from 'formdata-polyfill/esm.min';

export function createFile () {
  const formData = new FormData();
  // formData.append('file', new File(readFileSync('./tests/static/500.png'), '500.png', {
  //   type: MimeTypes.PNG,
  // }));
  return formData
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
