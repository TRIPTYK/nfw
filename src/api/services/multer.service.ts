import * as Multer from "multer";
import { Request } from "express";
import {sync as mkdirpSync} from "mkdirp";
import BaseService from "../../core/services/base.service";
import { singleton, autoInjectable } from "tsyringe";

enum StorageType {
    MEMORY,
    DISK
}

@singleton()
@autoInjectable()
class MulterService extends BaseService {
    private multers = {
        [StorageType.MEMORY] : {},
        [StorageType.DISK] : {}
    };

    public init() {
        return true;
    }

    public makeMulter(type: StorageType, destinationOrName: string, validate, maxFileSize: number): any {
        if (this.multers[type][destinationOrName]) {
            return this.multers[type][destinationOrName];
        }

        if (type === StorageType.DISK) {
            // sync is done 1 time on instanciation , not a big deal for performances
            mkdirpSync(destinationOrName);
        }

        const storage = type === StorageType.DISK ? Multer.diskStorage({
            destination(req: Request, file: any, next: (err: Error, destination: string) => void ) {
                next(null, destinationOrName);
            },
            filename(req: Request, file, next: (err: Error, destination: string) => void) {
                next(null, `${file.originalname}-${Date.now()}`);
            }
        }) : Multer.memoryStorage();

        // Return configured multer instance, with size and file type rejection
        const built = Multer({
            fileFilter: validate,
            limits: {
                fileSize: maxFileSize
            },
            storage
        });

        return this.multers[type][destinationOrName] = built;
    }
}

export {
    StorageType,
    MulterService
};

