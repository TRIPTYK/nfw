
import { Attribute, JsonApiResource, Relationship, Resource } from '@triptyk/nfw-jsonapi';
import { UserModel } from '../models/user.model.js';
import type { DocumentResource } from './document.resource.js';

@JsonApiResource({
  entity: UserModel,
  entityName: 'users',
})
export class UserResource extends Resource<UserModel> {
  @Attribute({
    filterable: {
      $eq: true,
    },
    sortable: ['ASC', 'DESC'],
  })
  declare id: string;

  @Attribute()
  declare firstName: string;

  @Attribute()
  declare email: string;

  @Attribute()
  declare role: string;

  @Attribute({
    fetchable: false,
    filterable: false,
    sortable: false,
  })
  declare password: string;

  @Attribute()
  declare lastName: string;

  @Relationship({
    otherResource: 'DocumentResource',
  })
  declare documents: DocumentResource[];
}
