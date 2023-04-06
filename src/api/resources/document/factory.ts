import { singleton } from '@triptyk/nfw-core';
import { ResourceFactoryImpl } from 'resources';
import type { DocumentResource } from './resource.js';

@singleton()
export class DocumentResourceFactory extends ResourceFactoryImpl<DocumentResource> {}
