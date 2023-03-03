import type { Loaded } from '@mikro-orm/core';
import { injectable } from '@triptyk/nfw-core';
import type { Resource, JsonApiContext } from '@triptyk/nfw-jsonapi';
import { ResourceService } from '@triptyk/nfw-jsonapi';
import type { DocumentModel } from '../../database/models/document.model.js';

@injectable()
export class DocumentResourceService extends ResourceService<DocumentModel> {
  async updateOne (resource: Resource<DocumentModel>, _ctx: JsonApiContext<DocumentModel, Resource<DocumentModel>>): Promise<Loaded<DocumentModel, never>> {
    const entity = await this.repository.findOneOrFail({ id: resource.id } as any);
    await entity?.removeFromDisk();
    return super.updateOne(resource, _ctx);
  }
}
