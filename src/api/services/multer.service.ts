import * as Multer from "multer";
import { Request } from "express";
import {singleton} from "tsyringe";

enum StorageType {
    MEMORY,
    DISK
}

@singleton()
class MulterService {
    private multers: object = {
        [StorageType.MEMORY] : {},
        [StorageType.DISK] : {}
    };

    public makeMulter(type: StorageType, destinationOrName: string, validate, maxFileSize: number) {
        if (this.multers[type][destinationOrName]) {
            return this.multers[type][destinationOrName];
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

