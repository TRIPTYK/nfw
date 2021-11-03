import { autoInjectable, singleton } from '@triptyk/nfw-core';
import { mkdirSync } from 'fs';
import Multer from 'multer';

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
    name: string,
    validate: any,
    maxFileSize: number,
  ): any {
    if (this.multers[type][name]) {
      return this.multers[type][name];
    }

    if (type === StorageType.DISK) {
      mkdirSync(name, { recursive: true })
    }

    const storage =
      type === StorageType.DISK
        ? Multer.diskStorage({
          destination (
            req,
            file,
            next,
          ) {
            next(null, name);
          },
          filename (
            req,
            file,
            next,
          ) {
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

    return (this.multers[type][name] = built)
  }
}
