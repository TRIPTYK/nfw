import { autoInjectable, singleton } from '@triptyk/nfw-core';
import { mkdirSync } from 'fs';
import Multer from '@koa/multer';

export enum StorageType {
  MEMORY,
  DISK
}

@singleton()
@autoInjectable()
export class MulterService {
  private multers: {
    [type: string]: {
      [name: string]: any,
    },
  } = {
    [StorageType.MEMORY]: {},
    [StorageType.DISK]: {},
  }

  public makeMulter (
    type: StorageType,
    destination: string,
    validate: any,
    maxFileSize: number,
  ): any {
    if (this.multers[type][destination]) {
      return this.multers[type][destination];
    }

    if (type === StorageType.DISK) {
      mkdirSync(destination, { recursive: true })
    }
    const storage =
      type === StorageType.DISK
        ? Multer.diskStorage({
          destination: function (
            req,
            file,
            next,
          ) {
            next(null, destination);
          },
          filename: function (
            req,
            file,
            next,
          ) {
            console.log('file');
            next(null, `${file.originalname}-${Date.now()}`)
          },
        })
        : Multer.memoryStorage();


    const built = Multer({
      fileFilter: validate,
      limits: {
        fileSize: maxFileSize,
      },
      storage,
    });

    return (this.multers[type][destination] = built)
  }
}
