import { BaseSerializer } from "./base.serializer";

export class DocumentSerializer extends BaseSerializer {

  constructor() { super('documents', [ 
    'fieldname', 
    'filename', 
    'path', 
    'mimetype', 
    'size', 
    'user', 
    'createdAt' 
  ]) };

}