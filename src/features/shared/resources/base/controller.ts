import type { EntityData, RequiredEntityData } from '@mikro-orm/core';
import type { JsonApiQuery, ResourceSerializer } from '@triptyk/nfw-resources';
import type { UserModel } from '../../../users/models/user.model.js';
import type { ResourceAuthorizer } from './authorizer.js';
import type { ResourceService } from './service.js';

export interface JsonApiContext<R extends Record<string, unknown>, T> {
    service: ResourceService<T>,
    authorizer: ResourceAuthorizer<T>,
    serializer: ResourceSerializer,
}
