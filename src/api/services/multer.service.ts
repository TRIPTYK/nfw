import Multer from "multer";
import { Request } from "express";

enum StorageType {
    MEMORY,
    DISK
}

class MulterService {
    public static makeMulter(type: StorageType, destinationOrName: string, validate, maxFileSize: number)
    : Multer.Instance {
        if (MulterService.multers[type][destinationOrName]) {
            return MulterService.multers[type][destinationOrName];
        }

        const storage = type === StorageType.MEMORY ? Multer.diskStorage({
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

        MulterService.multers[type][destinationOrName] = built;

        return built;
    }

    private static multers: object;
}

export {
    StorageType,
    MulterService
};

