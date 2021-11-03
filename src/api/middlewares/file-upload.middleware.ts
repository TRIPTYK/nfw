import { RouterContext } from '@koa/router'
import { inject, injectable, MiddlewareInterface } from '@triptyk/nfw-core'
import { MulterService, StorageType } from '../services/multer.services.js';

export type FileUploadMiddlewareArgs = {
    type: "single" | "multiple";
    fieldName: string & "document";
};

@injectable()
export class FileUploadMiddleware implements MiddlewareInterface {
  constructor (@inject(MulterService) private multer: MulterService) {}

  async use (
    context: RouterContext,
    next: any,
    args?: FileUploadMiddlewareArgs) {
    //NB: look For validation
    console.log('middleware start');
    const { type , fieldName } = args || { type : "single", fieldName : "document" };
    const multerInstance = this.multer.makeMulter(
      StorageType.DISK,
      fieldName,
      {},
      50000
    );

    console.log(multerInstance.single(fieldName))
    if (type === 'single') {
      await multerInstance.single(fieldName);
    }
 
    await multerInstance.array(fieldName);
    await next();
  }
}
